import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    return role;
  }

  async findAllPermissions() {
    return this.prisma.permission.findMany({
      include: {
        module: true,
        feature: true,
      },
    });
  }

  async create(data: any) {
    const { name, permissionIds } = data;
    return this.prisma.role.create({
      data: {
        name,
        permissions: {
          create: (permissionIds || []).map((pId: number) => ({
            permissionId: pId,
          })),
        },
      },
    });
  }

  async update(id: number, data: any) {
    const { name, permissionIds } = data;
    
    // Check if role exists
    await this.findOne(id);

    // Sync permissions
    if (permissionIds) {
      await this.prisma.rolePermission.deleteMany({
        where: { roleId: id },
      });
    }

    return this.prisma.role.update({
      where: { id },
      data: {
        name,
        permissions: {
          create: (permissionIds || []).map((pId: number) => ({
            permissionId: pId,
          })),
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.role.delete({
      where: { id },
    });
  }
}
