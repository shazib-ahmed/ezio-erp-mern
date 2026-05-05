import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: number, search?: string, limit: number = 10, cursor?: number) {
    const whereClause: any = {
      tenantId,
      deletedAt: null, // Respect soft delete
      ...(search && {
        OR: [
          { name: { contains: search } },
        ],
      }),
    };

    const products = await this.prisma.product.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      where: whereClause,
      include: { 
        category: true,
        brand: true 
      },
      orderBy: { createdAt: 'desc' },
    });

    let nextCursor: number | null = null;
    if (products.length > limit) {
      const nextItem = products.pop();
      if (nextItem) {
        nextCursor = nextItem.id;
      }
    }

    return {
      data: products,
      nextCursor,
    };
  }

  async findOne(id: number, tenantId: number) {
    const product = await this.prisma.product.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { 
        category: true,
        brand: true 
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(tenantId: number, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...dto,
        tenantId,
      },
      include: {
        category: true
      }
    });
  }

  async update(id: number, tenantId: number, dto: UpdateProductDto) {
    await this.findOne(id, tenantId);

    return this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
      },
      include: {
        category: true
      }
    });
  }

  async remove(id: number, tenantId: number) {
    await this.findOne(id, tenantId);

    // Soft delete
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getInventoryStats(tenantId: number) {
    const products = await this.prisma.product.findMany({
      where: { tenantId, deletedAt: null },
    });

    let outOfStock = 0;
    let lowStock = 0;
    const totalProducts = products.length;

    products.forEach(product => {
      const attrs = (product.attributes as any) || {};
      // Try to find a stock-related attribute (case-insensitive)
      const stockKey = Object.keys(attrs).find(k => 
        ['stock', 'quantity', 'qty', 'stock count'].includes(k.toLowerCase())
      );

      if (stockKey) {
        const stockValue = parseInt(attrs[stockKey]) || 0;
        if (stockValue <= 0) {
          outOfStock++;
        } else if (stockValue <= 5) { // Default low stock threshold
          lowStock++;
        }
      }
    });

    return {
      totalProducts,
      outOfStock,
      lowStock,
    };
  }
}
