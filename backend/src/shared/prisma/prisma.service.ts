import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // Note: Prisma 5.0+ handles shutdown hooks differently or automatically in some cases, 
    // but we'll keep a reference here if needed for older versions or custom logic.
  }
}
