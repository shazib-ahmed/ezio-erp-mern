import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

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

    const brands = await this.prisma.brand.findMany({
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
    if (brands.length > limit) {
      const nextItem = brands.pop();
      if (nextItem) {
        nextCursor = nextItem.id;
      }
    }

    return {
      data: brands,
      nextCursor,
    };
  }

  async findOne(id: number, tenantId: number) {
    const brand = await this.prisma.brand.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  async create(tenantId: number, dto: CreateBrandDto) {
    return this.prisma.brand.create({
      data: {
        ...dto,
        tenantId,
      },
    });
  }

  async update(id: number, tenantId: number, dto: UpdateBrandDto) {
    await this.findOne(id, tenantId);

    return this.prisma.brand.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, tenantId: number) {
    await this.findOne(id, tenantId);

    return this.prisma.brand.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
