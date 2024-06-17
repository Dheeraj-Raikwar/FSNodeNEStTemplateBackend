import { IsEmpty, IsEnum, IsNotEmpty, IsOptional} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from "prisma/prisma-client";

export class CreateUserDto {

  @ApiProperty()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(UserStatus)
  readonly status?: UserStatus;

  @ApiProperty()
  @IsNotEmpty()
  role: string[];

  @ApiProperty()
  @IsEmpty()
  password: string;
}
