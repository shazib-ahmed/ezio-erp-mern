import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: number, search?: string, limit: number = 10, cursor?: number, type?: string, method?: string, accountId?: number) {
    const whereClause: any = {
      tenantId,
      deletedAt: null,
      ...(type && { type }),
      ...(method && { method }),
      ...(accountId && { accountId }),
      ...(search && {
        OR: [
          { trxId: { contains: search } },
          { purpose: { contains: search } },
          { referenceNo: { contains: search } },
          { type: { contains: search } },
          { method: { contains: search } },
          // Search by amount if numeric
          ...(!isNaN(Number(search)) ? [{ amount: { equals: Number(search) } }] : []),
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

    const accounts = await this.prisma.account.findMany({
      where: { tenantId, deletedAt: null },
      select: { balance: true },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((trx) => {
      if (trx.type === 'INCOME') {
        totalIncome += Number(trx.amount);
      } else if (trx.type === 'EXPENSE') {
        totalExpense += Number(trx.amount);
      }
    });

    const netBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

    return {
      totalIncome,
      totalExpense,
      netBalance,
    };
  }

  async getExportData(tenantId: number, fromDate: string, toDate: string) {
    const start = new Date(fromDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        tenantId,
        deletedAt: null,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        account: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return transactions.map((t) => ({
      Date: new Date(t.createdAt).toLocaleDateString(),
      TrxID: t.trxId,
      Purpose: t.purpose,
      Account: t.account?.name || 'N/A',
      Method: t.method,
      Amount: Number(t.amount),
      Type: t.type,
    }));
  }
}
