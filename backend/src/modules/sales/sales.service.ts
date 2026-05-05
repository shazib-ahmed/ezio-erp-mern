import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, dto: CreateSaleDto) {
    const { items, paidAmount, paymentMethod, customerId, discount = 0, accountId, referenceNo } = dto;

    return this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;

      // 1. Calculate total and check stock
      for (const item of items) {
        const product = await tx.product.findFirst({
          where: { id: item.productId, tenantId, deletedAt: null },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        // Ideally check stock here if we had a stock field in Product model 
        // According to schema, stock management might be in a separate model or added later
        // For now, we follow the schema provided.

        totalAmount += Number(item.unitPrice) * item.quantity;
      }

      const payableAmount = totalAmount - discount;
      const dueAmount = Math.max(0, payableAmount - paidAmount);
      const paymentStatus = dueAmount <= 0 ? 'PAID' : (paidAmount > 0 ? 'PARTIAL' : 'DUE');

      // 2. Generate Invoice Number
      const lastSale = await tx.sale.findFirst({
        where: { tenantId },
        orderBy: { id: 'desc' },
      });
      const nextId = (lastSale?.id || 0) + 1;
      const invoiceNo = `INV-${new Date().getFullYear()}-${nextId.toString().padStart(4, '0')}`;

      // 3. Create Sale
      const sale = await tx.sale.create({
        data: {
          invoiceNo,
          totalAmount,
          discount,
          payableAmount,
          paidAmount,
          dueAmount,
          status: paymentStatus as any,
          tenantId,
          customerId,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subTotal: Number(item.unitPrice) * item.quantity,
            })),
          },
        },
      });

      // 4. Create Transaction
      if (paidAmount > 0) {
        const trxId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        await tx.transaction.create({
          data: {
            trxId,
            amount: paidAmount,
            type: 'INCOME',
            purpose: `Sale Payment - ${invoiceNo}`,
            method: paymentMethod as any,
            referenceNo,
            tenantId,
            saleId: sale.id,
            customerId,
            accountId,
          },
        });

        // Update Account balance if accountId is provided
        if (accountId) {
          await tx.account.update({
            where: { id: accountId },
            data: {
              balance: { increment: paidAmount }
            }
          });
        }
      }

      // 5. Update Customer Due if applicable
      if (customerId && dueAmount > 0) {
        await tx.customer.update({
          where: { id: customerId },
          data: {
            totalDue: { increment: dueAmount },
          },
        });
      }

      return sale;
    });
  }

  async findAll(tenantId: number, search?: string, limit: number = 10, cursor?: number) {
    const whereClause: any = {
      tenantId,
      deletedAt: null,
      ...(search && {
        OR: [
          { invoiceNo: { contains: search } },
          { customer: { name: { contains: search } } },
        ],
      }),
    };

    const sales = await this.prisma.sale.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      where: whereClause,
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let nextCursor: number | null = null;
    if (sales.length > limit) {
      const nextItem = sales.pop();
      if (nextItem) {
        nextCursor = nextItem.id;
      }
    }

    return {
      data: sales,
      nextCursor,
    };
  }

  async getCustomers(tenantId: number) {
    return this.prisma.customer.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }
}
