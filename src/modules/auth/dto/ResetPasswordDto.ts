import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ResetPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8, {
      message: 'New password must be min $constraint1 characters',
    })
    readonly newPassword: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8, {
      message: 'Confirm password must be min $constraint1 characters',
    })
    readonly confirmPassword: string;

    token: string
  }