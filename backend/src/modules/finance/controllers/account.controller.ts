import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  ParseIntPipe,
  Query 
} from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('finance/accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @Permissions('ACCOUNT_VIEW')
  findAll(
    @GetUser('tenantId') tenantId: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.accountService.findAll(
      Number(tenantId),
      search,
      limit ? Number(limit) : 10,
      cursor ? Number(cursor) : undefined,
    );
  }

  @Post()
  @Permissions('ACCOUNT_MANAGE')
  create(@GetUser('tenantId') tenantId: string, @Body() data: any) {
    return this.accountService.create(Number(tenantId), data);
  }

  @Patch(':id')
  @Permissions('ACCOUNT_MANAGE')
  update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('tenantId') tenantId: string,
    @Body() data: any,
  ) {
    return this.accountService.update(id, Number(tenantId), data);
  }

  @Delete(':id')
  @Permissions('ACCOUNT_MANAGE')
  remove(@Param('id', ParseIntPipe) id: number, @GetUser('tenantId') tenantId: string) {
    return this.accountService.remove(id, Number(tenantId));
  }
}
