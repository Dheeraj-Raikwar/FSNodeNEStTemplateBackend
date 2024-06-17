import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma-service/prisma.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PermissionModule,
    RoleModule,
    PrismaModule
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
