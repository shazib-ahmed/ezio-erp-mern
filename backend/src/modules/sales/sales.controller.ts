import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  ParseIntPipe 
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Permissions('SALE_CREATE')
  create(
    @GetUser('tenantId') tenantId: string,
    @Body() dto: CreateSaleDto,
  ) {
    return this.salesService.create(Number(tenantId), dto);
  }

  @Get()
  @Permissions('SALE_VIEW')
  findAll(
    @GetUser('tenantId') tenantId: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.salesService.findAll(
      Number(tenantId),
      search,
      limit ? Number(limit) : 10,
      cursor ? Number(cursor) : undefined,
    );
  }

  @Get('customers')
  @Permissions('SALE_CREATE')
  getCustomers(@GetUser('tenantId') tenantId: string) {
    return this.salesService.getCustomers(Number(tenantId));
  }
}
