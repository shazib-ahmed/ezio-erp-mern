import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: number, search?: string, limit: number = 10, cursor?: number) {
    const whereClause: any = {
      tenantId,
      deletedAt: null,
      ...(search && {
        OR: [
          { trxId: { contains: search } },
          { purpose: { contains: search } },
          { referenceNo: { contains: search } },
        ],
      }),
    };

    const transactions = await this.prisma.transaction.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      where: whereClause,
      include: {
        customer: true,
        sale: true,
        expense: true,
        account: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    let nextCursor: number | null = null;
    if (transactions.length > limit) {
      const nextItem = transactions.pop();
      if (nextItem) {
        nextCursor = nextItem.id;
      }
    }

    return {
      data: transactions,
      nextCursor,
    };
  }
  async getStats(tenantId: number) {
    const transactions = await this.prisma.transaction.findMany({
      where: { tenantId, deletedAt: null },
      select: { amount: true, type: true },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((trx) => {
      if (trx.type === 'INCOME') {
        totalIncome += Number(trx.amount);
      } else {
        totalExpense += Number(trx.amount);
      }
    });

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
    };
  }
}
