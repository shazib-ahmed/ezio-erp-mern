import { 
  Controller, 
  Get, 
  Query 
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('finance/transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @Permissions('TRX_VIEW')
  findAll(
    @GetUser('tenantId') tenantId: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.transactionService.findAll(
      Number(tenantId),
      search,
      limit ? Number(limit) : 10,
      cursor ? Number(cursor) : undefined,
    );
  }

  @Get('stats')
  @Permissions('TRX_VIEW')
  getStats(@GetUser('tenantId') tenantId: string) {
    return this.transactionService.getStats(Number(tenantId));
  }
}
