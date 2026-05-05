import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';
import { ExpenseController } from './controllers/expense.controller';
import { ExpenseService } from './services/expense.service';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { PrismaModule } from '@/shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AccountController, ExpenseController, TransactionController],
  providers: [AccountService, ExpenseService, TransactionService],
  exports: [AccountService, ExpenseService, TransactionService],
})
export class FinanceModule {}
