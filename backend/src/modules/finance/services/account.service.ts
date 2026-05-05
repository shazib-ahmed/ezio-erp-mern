import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: number, search?: string, limit: number = 10, cursor?: number) {
    console.log('Fetching accounts for tenant:', tenantId, 'search:', search);
    const whereClause: any = {
      tenantId,
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search } },
          { accountType: { contains: search } },
        ],
      }),
    };

    const accounts = await this.prisma.account.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    console.log('Accounts found:', accounts.length);

    let nextCursor: number | null = null;
    if (accounts.length > limit) {
      const nextItem = accounts.pop();
      if (nextItem) {
        nextCursor = nextItem.id;
      }
    }

    return {
      data: accounts,
      nextCursor,
    };
  }

  async create(tenantId: number, data: any) {
    return this.prisma.account.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async update(id: number, tenantId: number, data: any) {
    const account = await this.prisma.account.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.prisma.account.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, tenantId: number) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Mark all transactions of this account as deleted
      await tx.transaction.updateMany({
        where: { accountId: id, tenantId },
        data: { deletedAt: new Date() }
      });

      // 2. Mark the account itself as deleted
      return tx.account.update({
        where: { id, tenantId },
        data: { deletedAt: new Date() }
      });
    });
  }
}
