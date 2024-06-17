/* Importing NestJS Packages */
import { Injectable } from '@nestjs/common';
import { Roles } from '@prisma/client';
/* Importing Util services */
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma-service/prisma.service';
import { Filters } from 'src/utils/types/filters';
import { AllDataResponse, ApiResponse } from 'src/utils/types/common';
import { UserService } from '../user/user.service';

@Injectable()
export class RoleService {
  constructor(
    private readonly Prisma: PrismaService,
    private userService: UserService
  ) { }

  /**
   * This function is used to create the roles
   * @param createRoleDto
   * @returns the created role
   */
  async create(createRoleDto: CreateRoleDto): Promise<ApiResponse<any>>{
    try {
      let permissions = createRoleDto.permission;
      delete createRoleDto.permission;
      if(!createRoleDto.alias){
        createRoleDto.alias = ''
      }
      const roleExist = await this.Prisma.roles.findFirst({
        where: {
              OR: [
                { name: { equals: createRoleDto.name } },
                { alias: { equals: createRoleDto.alias } }
              ]
            }
          
      })
      if(!roleExist){
        const res = await this.Prisma.roles.create({data:createRoleDto}); 
        // Assigning roles in the permissions
        for (let index = 0; index < permissions.length; index++) {
          permissions[index].roleId = res.id;     
        }
        if(res){
          const permissionRes = await this.Prisma.permissions.createMany({data:permissions})
        }
        return { success:true, data: res}

      } else{
        return { success:false, message: 'Role / alias already exist'}
        
      }
      
    } catch (error) {
      return { success:false, message: error}
    }
  }

  
  /**
   * This function is used to get all the roles
   * @returns the roles
   */
  async findAllRole(): Promise<any>{
    const allRoles = await this.Prisma.roles.findMany({select:{name:true,id:true}});	

    return {
			data: allRoles      
    }
  }
  /**
   * This function is used to get all the roles
   * @returns the roles
   */
  async findAll(filter: Filters, userId: string): Promise<any>{

    let filterQuery: Filters;		
		// Get the filter from the query param
		filterQuery = filter
		var offset = (filterQuery?.skip) ? Number(filterQuery.skip) : 0;
		var limit = (filterQuery?.take) ? Number(filterQuery.take) : 10;
		// Sorting based on the column
		var sortByColumn = (filterQuery.sortField) ? filterQuery.sortField : '';
		var pattern = (filterQuery.search) ? filterQuery.search : '';
		// Sorting the Columns
		if (sortByColumn !== '') {
			var direction = (filterQuery.sortOrder) ?( filterQuery.sortOrder == 'DESC') ? 'DESC':'ASC' : 'ASC';
			filterQuery.orderBy = [{sortByColumn: direction}];
		} else {
			filterQuery.orderBy = [{createdAt:'desc'}];
		}
		
		// Setting Offset and limit
		filterQuery.skip = offset;
		filterQuery.take = limit;
    filterQuery.include = {Permission: true}

    const [roles, count] = await this.Prisma.$transaction([
			this.Prisma.roles.findMany(filterQuery),
			this.Prisma.roles.count()
		]);	
    let permission = (await this.userService.userPermission(userId, "Settings")).data;
    return {
			data: roles,
			count: count,
      permissions: permission
    }
  }

  /**
   * This function is used to get the role by using id
   * @param id 
   * @returns the role
   */
  async findOne(id: string): Promise<AllDataResponse<Roles>> {
    const res = await this.Prisma.roles.findFirst({where:{id:id}})
    return {
      data: res
    }
  }

  /**
   * This function is used to update the roles from the DB
   * @param id 
   * @param updateRoleDto 
   * @returns updated role
   */
  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<AllDataResponse<any>> {
    try {
      
      let permission = updateRoleDto.permission
      delete updateRoleDto.permission

      const res = await this.Prisma.roles.update({where:{id:id},data:updateRoleDto})
      
      if(permission.length > 0){
        await this.Prisma.permissions.deleteMany({
            where: {
                roleId: res.id
            }
        });
        permission.map(perm=>{
          perm.roleId = res.id
        })
        let permissions = await this.Prisma.permissions.createMany({data:permission})
      }
      return {
        data: res
      }
    } catch (error) {
        return {
          data:error
        }
    }
  }

  /**
   * This function is used to delete the roles from the DB
   * @param id  
   * @returns 
   */
  async remove(id: string): Promise<AllDataResponse<Roles>> {
    const res =  await this.Prisma.roles.delete({
      where: {
        id: id
      }
    })
    return {
      data: res
    }
  }
}
