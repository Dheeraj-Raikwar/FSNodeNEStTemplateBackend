import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PrismaModule } from 'src/prisma-service/prisma.module';
import { UserService } from '../user/user.service';

@Module({
  imports:[PrismaModule],
  controllers: [RoleController],
  providers: [RoleService, UserService],
})
export class RoleModule {}
