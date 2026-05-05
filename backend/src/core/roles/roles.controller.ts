import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('ROLE_MANAGE')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get('permissions')
  @Permissions('ROLE_MANAGE')
  findAllPermissions() {
    return this.rolesService.findAllPermissions();
  }

  @Get(':id')
  @Permissions('ROLE_MANAGE')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @Permissions('ROLE_MANAGE')
  create(@Body() data: any) {
    return this.rolesService.create(data);
  }

  @Put(':id')
  @Permissions('ROLE_MANAGE')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.rolesService.update(id, data);
  }

  @Delete(':id')
  @Permissions('ROLE_MANAGE')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}
