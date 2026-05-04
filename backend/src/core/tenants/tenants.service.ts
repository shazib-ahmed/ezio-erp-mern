import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tenant.findMany({
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
        createdAt: 'desc',
      },
    });
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
