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
import { ExpenseService } from '../services/expense.service';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('finance/expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  @Permissions('EXPENSE_VIEW')
  findAll(
    @GetUser('tenantId') tenantId: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.expenseService.findAll(
      Number(tenantId),
      search,
      limit ? Number(limit) : 10,
      cursor ? Number(cursor) : undefined,
    );
  }

  @Post()
  @Permissions('EXPENSE_MANAGE')
  create(@GetUser('tenantId') tenantId: string, @Body() data: any) {
    return this.expenseService.create(Number(tenantId), data);
  }

  @Patch(':id')
  @Permissions('EXPENSE_MANAGE')
  update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('tenantId') tenantId: string,
    @Body() data: any,
  ) {
    return this.expenseService.update(id, Number(tenantId), data);
  }

  @Delete(':id')
  @Permissions('EXPENSE_MANAGE')
  remove(@Param('id', ParseIntPipe) id: number, @GetUser('tenantId') tenantId: string) {
    return this.expenseService.remove(id, Number(tenantId));
  }
}
