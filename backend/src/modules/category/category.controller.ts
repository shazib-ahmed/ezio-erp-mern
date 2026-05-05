import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('inventory/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Permissions('PRODUCT_VIEW')
  findAll(
    @GetUser('tenantId') tenantId: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.categoryService.findAll(
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
    return this.categoryService.findOne(id, Number(tenantId));
  }

  @Post()
  @Permissions('PRODUCT_CREATE')
  create(
    @GetUser('tenantId') tenantId: string,
    @Body() data: { name: string },
  ) {
    return this.categoryService.create(Number(tenantId), data);
  }

  @Patch(':id')
  @Permissions('PRODUCT_UPDATE')
  update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('tenantId') tenantId: string,
    @Body() data: { name?: string },
  ) {
    return this.categoryService.update(id, Number(tenantId), data);
  }

  @Delete(':id')
  @Permissions('PRODUCT_DELETE')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('tenantId') tenantId: string,
  ) {
    return this.categoryService.remove(id, Number(tenantId));
  }
}
