import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BrandService } from './brand.service';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { CloudinaryService } from '@/shared/cloudinary/cloudinary.service';

@Controller('inventory/brands')
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  @Permissions('PRODUCT_VIEW')
  findAll(
    @GetUser('tenantId') tenantId: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.brandService.findAll(
      Number(tenantId),
      search,
      limit ? Number(limit) : undefined,
      cursor ? Number(cursor) : undefined,
    );
  }

  @Get(':id')
  @Permissions('PRODUCT_VIEW')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('tenantId') tenantId: string,
  ) {
    return this.brandService.findOne(id, Number(tenantId));
  }

  @Post()
  @Permissions('PRODUCT_CREATE')
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @GetUser('tenantId') tenantId: string,
    @Body() dto: CreateBrandDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let logoUrl = undefined;
    if (file) {
      const result = await this.cloudinaryService.uploadImage(file, 'brands');
      logoUrl = result.secure_url;
    }
    return this.brandService.create(Number(tenantId), { ...dto, logo: logoUrl });
  }

  @Patch(':id')
  @Permissions('PRODUCT_UPDATE')
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('tenantId') tenantId: string,
    @Body() dto: UpdateBrandDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let logoUrl = dto.logo;
    if (file) {
      const result = await this.cloudinaryService.uploadImage(file, 'brands');
      logoUrl = result.secure_url;
    }
    return this.brandService.update(id, Number(tenantId), { ...dto, logo: logoUrl });
  }

  @Delete(':id')
  @Permissions('PRODUCT_DELETE')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('tenantId') tenantId: string,
  ) {
    return this.brandService.remove(id, Number(tenantId));
  }
}
