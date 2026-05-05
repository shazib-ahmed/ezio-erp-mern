import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(limit: number = 10, cursor?: number, search?: string) {
    const whereClause: any = {
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search } },
          { phone: { contains: search } },
          {
            users: {
              some: {
                OR: [
                  { name: { contains: search } },
                  { email: { contains: search } }
                ]
              }
            }
          }
        ]
      })
    };

    const tenants = await this.prisma.tenant.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      where: whereClause,
      include: {
        industry: true,
        users: true,
        activeModules: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    let nextCursor: number | null = null;
    if (tenants.length > limit) {
      const nextItem = tenants.pop();
      if (nextItem) {
        nextCursor = nextItem.id;
      }
    }

    return {
      data: tenants,
      nextCursor
    };
  }

  async findOne(id: number) {
    const tenant = await this.prisma.tenant.findFirst({
      where: { id, deletedAt: null },
      include: {
        industry: true,
        users: true,
        activeModules: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  async update(id: number, data: any) {
    await this.findOne(id);

    return this.prisma.tenant.update({
      where: { id },
      data,
      include: {
        industry: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.tenant.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async getStats() {
    const [totalTenants, totalIndustries] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.industry.count(),
    ]);

    return {
      totalTenants,
      totalIndustries,
    };
  }
}
