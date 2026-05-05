import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: number, search?: string, limit: number = 10, cursor?: number) {
    const whereClause: any = {
      tenantId,
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search } },
        ],
      }),
    };

    const categories = await this.prisma.category.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      where: whereClause,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let nextCursor: number | null = null;
    if (categories.length > limit) {
      const nextItem = categories.pop();
      if (nextItem) {
        nextCursor = nextItem.id;
      }
    }

    return {
      data: categories,
      nextCursor,
    };
  }

  async findOne(id: number, tenantId: number) {
    return this.prisma.category.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
  }

  async create(tenantId: number, data: { name: string }) {
    return this.prisma.category.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async update(id: number, tenantId: number, data: { name?: string }) {
    return this.prisma.category.updateMany({
      where: { id, tenantId },
      data,
    });
  }

  async remove(id: number, tenantId: number) {
    // Soft delete
    return this.prisma.category.updateMany({
      where: { id, tenantId },
      data: { deletedAt: new Date() },
    });
  }
}
