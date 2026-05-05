import {
  Controller,
  Patch,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@/core/auth/guards/jwt-auth.guard';
import { GetUser } from '@/shared/decorators/get-user.decorator';
import { AccountService } from './account.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '@prisma/client';

@Controller('account')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Patch('profile')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @GetUser('id') userId: number,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.accountService.updateProfile(userId, dto, file);
  }

  @Patch('tenant')
  async updateTenant(
    @GetUser('tenantId') tenantId: number,
    @Body() dto: any,
  ) {
    return this.accountService.updateTenant(Number(tenantId), dto);
  }
}
