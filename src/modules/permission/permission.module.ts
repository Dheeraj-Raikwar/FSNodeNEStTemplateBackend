import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PrismaModule } from 'src/prisma-service/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [PermissionController],
  providers: [ PermissionService],
})
export class PermissionModule {}
