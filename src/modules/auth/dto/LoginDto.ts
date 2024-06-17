import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}
