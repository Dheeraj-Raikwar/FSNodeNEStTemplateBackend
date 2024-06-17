import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class FilterUserDto {

  @ApiProperty()
  @IsOptional()
  readonly skip: number;

  @ApiProperty()
  @IsOptional()
  readonly take: number;

  @ApiProperty()
  @IsOptional()
  readonly sortField: string;

  @ApiProperty()
  @IsOptional()
  readonly sortOrder: string;

  @ApiProperty()
  @IsOptional()
  readonly search: string;

  @ApiProperty()
  @IsOptional()
  readonly filter: any;
}
