import { IsNotEmpty, IsOptional, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Old password must be min $constraint1 characters',
  })
  readonly oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'New password must be min $constraint1 characters',
  })
  readonly newPassword: string;
}
