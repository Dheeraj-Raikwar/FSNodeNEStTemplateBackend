import { IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './createPermissionDto';
export class PermissionDto extends PartialType(CreatePermissionDto) {
  @ApiProperty()
  @IsNotEmpty()
  readonly id?: string;
}
