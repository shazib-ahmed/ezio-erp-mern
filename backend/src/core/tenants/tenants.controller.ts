import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';

@Controller('admin/tenants')
@UseGuards(RolesGuard)
@Roles('SUPER_ADMIN')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}
  
  @Get()
  findAll(
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string
  ) {
    return this.tenantsService.findAll(
      limit ? Number(limit) : 10,
      cursor ? Number(cursor) : undefined
    );
  }

  @Get('stats')
  getStats() {
    return this.tenantsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTenantDto: any) {
    return this.tenantsService.update(+id, updateTenantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(+id);
  }
}
