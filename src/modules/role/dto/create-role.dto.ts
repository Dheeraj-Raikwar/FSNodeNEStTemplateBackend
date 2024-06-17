import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Permissions } from '@prisma/client';

export class CreateRoleDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly name: string;  

    @ApiProperty()
    @IsOptional()
    alias: string;

    @ApiProperty()
    @IsOptional()
    readonly isActive: boolean;

    @ApiProperty()
    @IsOptional()
    permission: Permissions[];    

}
