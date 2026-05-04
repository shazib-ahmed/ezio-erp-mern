import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { Industry } from '@prisma/client';

export interface IIndustryService {
  create(createIndustryDto: CreateIndustryDto): Promise<Industry>;
  findAll(limit?: number, cursor?: number): Promise<{ data: Industry[]; nextCursor: number | null }>;
  findOne(id: number): Promise<Industry>;
  update(id: number, updateIndustryDto: UpdateIndustryDto): Promise<Industry>;
  remove(id: number): Promise<Industry>;
}

@Injectable()
export class IndustryService implements IIndustryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createIndustryDto: CreateIndustryDto): Promise<Industry> {
    const { name, description, moduleIds } = createIndustryDto;
    
    return this.prisma.industry.create({
      data: {
        name,
        description,
        modules: moduleIds ? {
          connect: moduleIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        modules: true
      }
    });
  }

  async findAll(limit: number = 10, cursor?: number): Promise<{ data: Industry[]; nextCursor: number | null }> {
    const industries = await this.prisma.industry.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
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
    const industry = await this.prisma.industry.findUnique({
      where: { id },
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
    const { name, description, moduleIds } = updateIndustryDto;

    return this.prisma.industry.update({
      where: { id },
      data: {
        name,
        description,
        modules: moduleIds ? {
          set: moduleIds.map(id => ({ id }))
        } : undefined
      }
    });
  }

  async remove(id: number): Promise<Industry> {
    return this.prisma.industry.delete({
      where: { id }
    });
  }
}
