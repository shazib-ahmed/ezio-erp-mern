import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(limit: number = 10, cursor?: number) {
    const tenants = await this.prisma.tenant.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        industry: true,
        users: {
          include: {
            user: true,
          },
        },
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
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        industry: true,
        users: {
          include: {
            user: true,
          },
        },
        activeModules: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  async update(id: number, data: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return this.prisma.tenant.update({
      where: { id },
      data,
      include: {
        industry: true,
      },
    });
  }

  async remove(id: number) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    // Instead of deleting, we might want to deactivate, but for now we'll delete
    return this.prisma.tenant.delete({
      where: { id },
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
