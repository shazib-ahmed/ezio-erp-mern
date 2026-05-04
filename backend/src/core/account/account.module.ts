import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CloudinaryModule } from '@/shared/cloudinary/cloudinary.module';
import { PrismaModule } from '@/shared/prisma/prisma.module';

@Module({
  imports: [CloudinaryModule, PrismaModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
