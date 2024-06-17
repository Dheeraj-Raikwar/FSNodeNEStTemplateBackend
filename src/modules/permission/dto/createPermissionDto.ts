import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {

  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly roleId: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly action: any;

  @ApiProperty()
  @IsNotEmpty()
  readonly resources: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly isActive: boolean;
}
