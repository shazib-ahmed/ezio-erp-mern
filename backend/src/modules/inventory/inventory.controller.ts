import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  ParseIntPipe
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

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

  @Post('products')
  @Permissions('PRODUCT_CREATE')
  create(
    @GetUser('tenantId') tenantId: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.inventoryService.create(Number(tenantId), dto);
  }

  @Put('products/:id')
  @Permissions('PRODUCT_UPDATE')
  update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('tenantId') tenantId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.inventoryService.update(id, Number(tenantId), dto);
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
