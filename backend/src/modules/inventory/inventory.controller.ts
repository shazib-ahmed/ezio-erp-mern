import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { InventoryService } from './inventory.service';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { CloudinaryService } from '@/shared/cloudinary/cloudinary.service';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('products')
  @Permissions('PRODUCT_VIEW')
  findAll(
    @GetUser('tenantId') tenantId: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.inventoryService.findAll(
      Number(tenantId),
      search,
      limit ? Number(limit) : 10,
      cursor ? Number(cursor) : undefined,
    );
  }

  @Get('stats')
  @Permissions('PRODUCT_VIEW')
  getStats(@GetUser('tenantId') tenantId: string) {
    return this.inventoryService.getInventoryStats(Number(tenantId));
  }

  @Get('products/:id')
  @Permissions('PRODUCT_VIEW')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('tenantId') tenantId: string,
  ) {
    return this.inventoryService.findOne(id, Number(tenantId));
  }

  /**
   * Helper to validate dynamic attributes against industry definition
   */
  private async validateDynamicAttributes(tenantId: number, attributes: any, baseData: any, files?: Express.Multer.File[]) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { industry: true }
    });

    if (!tenant || !tenant.industry || !tenant.industry.attributes) return;

    const industryAttrs = tenant.industry.attributes as any[];
    
    for (const attr of industryAttrs) {
      if (attr.required) {
        const attrName = attr.name.trim();
        const attrNameLower = attrName.toLowerCase();
        
        let value = attributes[attrName];
        if (!value) {
            const foundKey = Object.keys(attributes).find(k => k.trim().toLowerCase() === attrNameLower);
            if (foundKey) value = attributes[foundKey];
        }

        if (!value && (attrNameLower === 'thumbnail' || attrNameLower === 'thumb')) {
            value = baseData.thumb;
        }

        if (!value && files && files.length > 0) {
            const file = files.find(f => {
                const fn = f.fieldname.trim().toLowerCase();
                return fn === attrNameLower || (attrNameLower === 'thumbnail' && fn === 'thumb') || (attrNameLower === 'thumb' && fn === 'thumbnail');
            });
            if (file) value = "FILE_PROVIDED";
        }

        if (attrNameLower === 'brand' && !value) value = baseData.brandId;
        if (attrNameLower === 'category' && !value) value = baseData.categoryId;

        if (!value || value === '') {
          throw new BadRequestException(`Attribute "${attrName}" is required for this industry.`);
        }
      }
    }
  }

  private async processAttributesAndFiles(dtoAttributes: any, baseData: any, files?: Express.Multer.File[]) {
    let parsedAttributes = {};
    if (dtoAttributes) {
      if (typeof dtoAttributes === 'string') {
        try { parsedAttributes = JSON.parse(dtoAttributes); } catch (e) { parsedAttributes = {}; }
      } else if (typeof dtoAttributes === 'object') {
        parsedAttributes = { ...dtoAttributes };
      }
    }

    if (typeof parsedAttributes !== 'object' || Array.isArray(parsedAttributes) || parsedAttributes === null) {
      parsedAttributes = {};
    }

    if (files && files.length > 0) {
      console.log(`[InventoryController] Processing ${files.length} files...`);
      for (const file of files) {
        const fieldName = file.fieldname.trim().toLowerCase();
        console.log(`[InventoryController] Uploading file: ${file.fieldname} (mapped to ${fieldName})`);
        
        try {
          const result = await this.cloudinaryService.uploadImage(file, 'products');
          console.log(`[InventoryController] Upload success for ${file.fieldname}:`, result.secure_url);
          
          if (fieldName === 'thumb' || fieldName === 'thumbnail') {
            baseData.thumb = result.secure_url;
          } else {
            parsedAttributes[file.fieldname] = result.secure_url;
          }
        } catch (uploadError) {
          console.error(`[InventoryController] Cloudinary Upload Error for ${file.fieldname}:`, uploadError);
          throw new InternalServerErrorException(`Failed to upload ${file.fieldname}`);
        }
      }
    }

    return parsedAttributes;
  }

  @Post('products')
  @Permissions('PRODUCT_CREATE')
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @GetUser('tenantId') tenantId: string,
    @Body() body: any,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    try {
      console.log('[InventoryController] Create Body:', JSON.stringify(body, null, 2));
      const tId = Number(tenantId);
      const { attributes, ...rest } = body;
      
      const baseData: any = {
        name: rest.name,
        categoryId: rest.categoryId ? Number(rest.categoryId) : undefined,
        brandId: rest.brandId ? Number(rest.brandId) : null,
      };

      if (typeof rest.thumb === 'string' && rest.thumb.length > 0) {
        baseData.thumb = rest.thumb;
      }

      const finalAttributes = await this.processAttributesAndFiles(attributes, baseData, files);
      await this.validateDynamicAttributes(tId, finalAttributes, baseData, files);

      return await this.inventoryService.create(tId, {
        name: baseData.name,
        categoryId: baseData.categoryId,
        brandId: baseData.brandId,
        thumb: baseData.thumb, // Use the sanitized value from baseData
        attributes: finalAttributes,
      });
    } catch (error) {
      console.error('[InventoryController] Create Error:', error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Error creating product');
    }
  }

  @Put('products/:id')
  @Permissions('PRODUCT_UPDATE')
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('tenantId') tenantId: string,
    @Body() body: any,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    try {
      console.log('[InventoryController] Update Body:', JSON.stringify(body, null, 2));
      const tId = Number(tenantId);
      const { attributes, ...rest } = body;
      
      const baseData: any = {
        name: rest.name,
        categoryId: rest.categoryId ? Number(rest.categoryId) : undefined,
        brandId: rest.brandId ? Number(rest.brandId) : null,
      };

      if (typeof rest.thumb === 'string' && rest.thumb.length > 0) {
        baseData.thumb = rest.thumb;
      }

      const finalAttributes = await this.processAttributesAndFiles(attributes, baseData, files);
      await this.validateDynamicAttributes(tId, finalAttributes, baseData, files);

      return await this.inventoryService.update(id, tId, {
        name: baseData.name,
        categoryId: baseData.categoryId,
        brandId: baseData.brandId,
        thumb: baseData.thumb, // Use the sanitized value from baseData
        attributes: finalAttributes,
      });
    } catch (error) {
      console.error('[InventoryController] Update Error:', error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Error updating product');
    }
  }

  @Delete('products/:id')
  @Permissions('PRODUCT_DELETE')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('tenantId') tenantId: string,
  ) {
    return this.inventoryService.remove(id, Number(tenantId));
  }
}
