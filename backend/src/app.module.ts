import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './shared/prisma/prisma.module';
import { IndustryModule } from './core/industry/industry.module';
import { TenantsModule } from './core/tenants/tenants.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './core/auth/auth.module';
import { AccountModule } from './core/account/account.module';
import { JwtAuthGuard } from './core/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';

import { InventoryModule } from './modules/inventory/inventory.module';
import { RolesModule } from './core/roles/roles.module';
import { CategoryModule } from './modules/category/category.module';
import { BrandModule } from './modules/brand/brand.module';

@Module({
  imports: [
    PrismaModule, 
    IndustryModule, 
    AuthModule, 
    TenantsModule, 
    AccountModule,
    InventoryModule,
    RolesModule,
    CategoryModule,
    BrandModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule { }
