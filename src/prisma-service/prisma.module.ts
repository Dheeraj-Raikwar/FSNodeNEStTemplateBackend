import { Module } from '@nestjs/common';
import { PrismaServiceDwh } from './prisma.service-dwh';

import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}