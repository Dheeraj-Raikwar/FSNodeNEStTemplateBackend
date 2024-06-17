import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma.service';
import { Permissions } from '@prisma/client';
import { PermissionDto } from './dto/PermissionDto';
import { CreatePermissionDto } from './dto/createPermissionDto';
import { AllDataResponse } from 'src/utils/types/common';
@Injectable()
export class PermissionService {
    constructor(
        private readonly Prisma: PrismaService,
    ) { }

	/**
	 * Get the permission by Id
	 * @param id 
	 * @returns the Active permission
	 */
    async findOneById(id: string): Promise<AllDataResponse<Permissions>>{
		const res = await this.Prisma.permissions.findUnique({where:{
			id: id,
			isActive: true
		}});

		return {
			data: res
		}
	}

	/**
	 * this function is used to get all the permission based on the filters
	 * @param filter 
	 * @returns the permissions
	 */
    async findAll(): Promise<any>{
		const [permissions, count] = await this.Prisma.$transaction([
			this.Prisma.permissions.findMany(),
			this.Prisma.permissions.count()
		]);		

		return {
			data: permissions,
			count: count
		}
	}
    
	/**
	 * This function is used to create the Permission
	 * @param permissions 
	 * @returns the permission
	 */
    async create(permissions: CreatePermissionDto): Promise<AllDataResponse<Permissions>>{
		const res = await this.Prisma.permissions.create({data: permissions});
		return  {
			data: res
		}
	}

	/**
	 * This function is used to update the permission
	 * @param id 
	 * @param permissions 
	 * @returns the updated permission
	 */
    async update(id: string, permissions: PermissionDto): Promise<AllDataResponse<Permissions>>{
		const res =  await this.Prisma.permissions.update({
            data: permissions,
            where: {
                id: id
            }
        });

		return {data: res}
	}

	/**
	 * This function is used to update the permission
	 * @param id 
	 * @param permissions 
	 * @returns the updated permission
	 */
    async remove(id: string): Promise<AllDataResponse<Permissions>>{
		const res = await this.Prisma.permissions.delete({
            where: {
                id: id
            }
        });

		return {data: res}
	}
}
