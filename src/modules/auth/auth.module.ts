import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { PrismaModule } from 'src/prisma-service/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWTKEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    }),
    UserModule,
    PrismaModule
  ],
  providers: [AuthService,JwtStrategy,LocalStrategy],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
