import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class ExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: number, search?: string, limit: number = 10, cursor?: number, category?: string, accountId?: number) {
    const whereClause: any = {
      tenantId,
      deletedAt: null,
      ...(category && { category }),
      ...(accountId && {
        transactions: {
          some: {
            accountId,
            deletedAt: null
          }
        }
      }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { category: { contains: search } },
        ],
      }),
    };

    const expenses = await this.prisma.expense.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { 
        transactions: {
          include: { account: true }
        } 
      },
    });

    let nextCursor: number | null = null;
    if (expenses.length > limit) {
      const nextItem = expenses.pop();
      if (nextItem) {
        nextCursor = nextItem.id;
      }
    }

    return {
      data: expenses,
      nextCursor,
    };
  }

  async create(tenantId: number, data: any) {
    return this.prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          title: data.title,
          category: data.category,
          amount: Number(data.amount),
          expenseDate: data.expenseDate ? new Date(data.expenseDate) : new Date(),
          tenantId,
        },
      });

      await tx.transaction.create({
        data: {
          trxId: `TRX-EXP-${Date.now()}`,
          amount: Number(data.amount),
          type: 'EXPENSE',
          purpose: `Expense: ${data.title}`,
          method: data.method || 'CASH',
          referenceNo: data.referenceNo,
          expenseId: expense.id,
          accountId: Number(data.accountId),
          tenantId,
        },
      });

      if (data.accountId) {
        await tx.account.update({
          where: { id: Number(data.accountId) },
          data: { balance: { decrement: Number(data.amount) } },
        });
      }

      return expense;
    });
  }

  async update(id: number, tenantId: number, data: any) {
    console.log('Updating expense:', { id, tenantId, data });
    return this.prisma.$transaction(async (tx) => {
      const oldExpense = await tx.expense.findFirst({
        where: { id, tenantId, deletedAt: null },
        include: { transactions: true }
      });

      if (!oldExpense) throw new NotFoundException('Expense not found');

      const transaction = oldExpense.transactions.find(t => t.type === 'EXPENSE');
      const oldAmount = parseFloat(oldExpense.amount.toString());
      const newAmount = parseFloat(data.amount.toString());
      const oldAccountId = transaction?.accountId ? parseInt(transaction.accountId.toString()) : null;
      const newAccountId = data.accountId ? parseInt(data.accountId.toString()) : null;

      console.log('--- EXPENSE UPDATE DEBUG ---');
      console.log('Old Data:', { oldAmount, oldAccountId });
      console.log('New Data:', { newAmount, newAccountId });
      console.log('Diff:', newAmount - oldAmount);

      if (isNaN(newAmount)) throw new Error('Invalid amount provided');

      // Balance Adjustment Logic
      if (oldAccountId && !isNaN(oldAccountId)) {
        if (oldAccountId === newAccountId) {
          const diff = newAmount - oldAmount;
          console.log(`Step 1: Same account ${oldAccountId}. Adjusting balance by ${-diff}`);
          await tx.account.update({
            where: { id: oldAccountId },
            data: { balance: { decrement: diff } }
          });
        } else {
          console.log(`Step 1: Different accounts. Reverting ${oldAmount} to ${oldAccountId}`);
          await tx.account.update({
            where: { id: oldAccountId },
            data: { balance: { increment: oldAmount } }
          });
          
          if (newAccountId && !isNaN(newAccountId)) {
            console.log(`Step 2: Deducting ${newAmount} from new account ${newAccountId}`);
            await tx.account.update({
              where: { id: newAccountId },
              data: { balance: { decrement: newAmount } }
            });
          }
        }
      } else if (newAccountId && !isNaN(newAccountId)) {
        // Legacy or first-time link
        const diff = newAmount - oldAmount;
        console.log(`Step 1 (Legacy): First link to account ${newAccountId}. Deducting diff ${diff}`);
        await tx.account.update({
          where: { id: newAccountId },
          data: { balance: { decrement: diff } }
        });
      }

      console.log('Step 3: Updating Transaction record');
      // 3. Update or Create Transaction
      if (transaction) {
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            amount: newAmount,
            accountId: newAccountId && !isNaN(newAccountId) ? newAccountId : null,
            purpose: `Expense (Updated): ${data.title}`,
            referenceNo: data.referenceNo,
            method: data.method
          }
        });
      } else if (newAccountId && !isNaN(newAccountId)) {
        await tx.transaction.create({
          data: {
            trxId: `TRX-EXP-${Date.now()}`,
            amount: newAmount,
            type: 'EXPENSE',
            purpose: `Expense (Updated): ${data.title}`,
            method: data.method || 'CASH',
            referenceNo: data.referenceNo,
            expenseId: id,
            accountId: newAccountId,
            tenantId,
          }
        });
      }

      console.log('Step 4: Finalizing Expense update');
      // 4. Update Expense
      return tx.expense.update({
        where: { id },
        data: {
          title: data.title,
          category: data.category,
          amount: newAmount,
          expenseDate: data.expenseDate ? new Date(data.expenseDate) : new Date(),
        }
      });
    });
  }

  async remove(id: number, tenantId: number) {
    return this.prisma.$transaction(async (tx) => {
      const expense = await tx.expense.findFirst({
        where: { id, tenantId, deletedAt: null },
        include: { transactions: true }
      });

      if (!expense) throw new NotFoundException('Expense not found');

      const transaction = expense.transactions.find(t => t.type === 'EXPENSE');
      
      // 1. Restore account balance if a transaction exists
      if (transaction && transaction.accountId) {
        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: Number(expense.amount) } }
        });
      }

      // 2. Mark associated transactions as deleted
      await tx.transaction.updateMany({
        where: { expenseId: id },
        data: { deletedAt: new Date() }
      });

      // 3. Mark expense as deleted
      return tx.expense.update({
        where: { id },
        data: { deletedAt: new Date() }
      });
    });
  }
}
