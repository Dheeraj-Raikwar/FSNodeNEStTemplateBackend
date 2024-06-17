import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@internal/prisma-dwh/client';

@Injectable()
export class PrismaServiceDwh extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}