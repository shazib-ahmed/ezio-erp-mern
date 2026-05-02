import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { Industry } from '@prisma/client';

export interface IIndustryService {
  create(createIndustryDto: CreateIndustryDto): Promise<Industry>;
  findAll(): Promise<Industry[]>;
  findOne(id: string): Promise<Industry>;
  update(id: string, updateIndustryDto: UpdateIndustryDto): Promise<Industry>;
  remove(id: string): Promise<Industry>;
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

  async findAll(): Promise<Industry[]> {
    return this.prisma.industry.findMany({
      include: {
        modules: true,
        _count: {
          select: { tenants: true }
        }
      }
    });
  }

  async findOne(id: string): Promise<Industry> {
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

  async update(id: string, updateIndustryDto: UpdateIndustryDto): Promise<Industry> {
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

  async remove(id: string): Promise<Industry> {
    return this.prisma.industry.delete({
      where: { id }
    });
  }
}
