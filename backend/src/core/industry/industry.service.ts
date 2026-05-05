import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { Industry } from '@prisma/client';

export interface IIndustryService {
  create(createIndustryDto: CreateIndustryDto): Promise<Industry>;
  findAll(limit?: number, cursor?: number, search?: string): Promise<{ data: Industry[]; nextCursor: number | null }>;
  findOne(id: number): Promise<Industry>;
  update(id: number, updateIndustryDto: UpdateIndustryDto): Promise<Industry>;
  remove(id: number): Promise<Industry>;
}

@Injectable()
export class IndustryService implements IIndustryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createIndustryDto: CreateIndustryDto): Promise<Industry> {
    const { name, description, moduleIds, attributes } = createIndustryDto;
    
    return this.prisma.industry.create({
      data: {
        name,
        description,
        attributes,
        modules: moduleIds ? {
          connect: moduleIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        modules: true
      }
    });
  }

  async findAll(limit: number = 10, cursor?: number, search?: string): Promise<{ data: Industry[]; nextCursor: number | null }> {
    const whereClause: any = {
      deletedAt: null,
      ...(search && {
        name: { contains: search }
      })
    };

    const industries = await this.prisma.industry.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      where: whereClause,
      orderBy: { id: 'asc' },
      include: {
        modules: true,
        _count: {
          select: { tenants: true }
        }
      }
    });

    let nextCursor: number | null = null;
    if (industries.length > limit) {
      const nextItem = industries.pop();
      if (nextItem) {
        nextCursor = nextItem.id;
      }
    }

    return {
      data: industries,
      nextCursor
    };
  }

  async findOne(id: number): Promise<Industry> {
    const industry = await this.prisma.industry.findFirst({
      where: { id, deletedAt: null },
      include: {
        modules: true,
        tenants: true
      }
    });

    if (!industry) {
      throw new NotFoundException(`Industry with ID ${id} not found`);
    }

    return industry;
  }

  async update(id: number, updateIndustryDto: UpdateIndustryDto): Promise<Industry> {
    const { name, description, moduleIds, attributes } = updateIndustryDto;
    
    await this.findOne(id); // Ensure exists and not deleted

    return this.prisma.industry.update({
      where: { id },
      data: {
        name,
        description,
        attributes,
        modules: moduleIds ? {
          set: moduleIds.map(id => ({ id }))
        } : undefined
      }
    });
  }

  async remove(id: number): Promise<Industry> {
    await this.findOne(id); // Ensure exists and not deleted
    
    return this.prisma.industry.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
