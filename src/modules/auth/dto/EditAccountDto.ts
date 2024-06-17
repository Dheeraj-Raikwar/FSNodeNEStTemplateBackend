import { IsOptional, IsString } from 'class-validator';

export class EditAccountDto {
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;
}
