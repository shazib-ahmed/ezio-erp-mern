import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CloudinaryService } from '@/shared/cloudinary/cloudinary.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: any = { ...dto };

    // Check for unique constraints if updated
    if (dto.email && dto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existing) throw new ConflictException('Email already in use');
    }

    if (dto.username && dto.username !== user.username) {
      const existing = await this.prisma.user.findUnique({ where: { username: dto.username } });
      if (existing) throw new ConflictException('Username already in use');
    }

    if (dto.phone && dto.phone !== user.phone) {
      const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
      if (existing) throw new ConflictException('Phone number already in use');
    }

    // Hash password if provided
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    // Upload avatar if provided
    if (file) {
      const result = await this.cloudinary.uploadImage(file, 'users');
      updateData.avatar = result.secure_url;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        roles: { include: { role: true } },
        tenant: true,
      },
    });

    const { password, refreshToken, ...resultUser } = updatedUser;

    return resultUser;
  }
}
