import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { CloudinaryModule } from '@/shared/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],
})
export class BrandModule {}
