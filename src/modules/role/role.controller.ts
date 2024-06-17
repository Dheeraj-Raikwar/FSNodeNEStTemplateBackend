/* Importing NestJS Packages */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards, Request } from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
/* Importing Util services */
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService }   from './role.service';
import { Filters }       from 'src/utils/types/filters';
import { ExceptionInterceptor } from 'src/utils/types/Exception';
import { ApiResponse, CustomRequest }   from 'src/utils/types/common';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(ExceptionInterceptor)
  @ApiOperation({ summary: 'Create Role', description: 'Create Role for the users with permission' })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<ApiResponse<UpdateRoleDto>> {
    try {
      const response =  await this.roleService.create(createRoleDto);
      return {
        success: true,
        ...response,
      }
    } catch (error) {
      throw  new ExceptionsHandler(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @UseInterceptors(ExceptionInterceptor)
  @ApiOperation({ summary: 'Get all Roles', description: 'Get all the Roles with permissions' })
  async findAll(@Query() filter : Filters,@Request() req:CustomRequest): Promise<ApiResponse<CreateRoleDto[]>>{
    try{
      const response =  await this.roleService.findAll(filter,req.user.id);
      return {
        success: true,
        ...response,
      }
    } catch(error){ 
      throw  new ExceptionsHandler(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  @UseInterceptors(ExceptionInterceptor)
  @ApiOperation({ summary: 'Get the Roles', description: 'Delete the Role' })
  async findAllRole(): Promise<ApiResponse<UpdateRoleDto>> {
    try {
      const response = await this.roleService.findAllRole();
      return {
        success: true,
        ...response,       
      }
    } catch (error) {
      throw  new ExceptionsHandler(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @UseInterceptors(ExceptionInterceptor)
  @ApiOperation({ summary: 'Get Role by Id', description: 'Get the Role by Id with permissions' })
  async findOne(@Param('id') id: string): Promise<ApiResponse<UpdateRoleDto>>{
    try {
      const response = await this.roleService.findOne(id);
      return {
        success: true,
        ...response,
      }
    } catch (error) {
      throw  new ExceptionsHandler(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(ExceptionInterceptor)
  @ApiOperation({ summary: 'Update the Role', description: 'Update the Role with permissions' })
  async update(@Param('id') id: string, @Body() createRoleDto: CreateRoleDto): Promise<ApiResponse<UpdateRoleDto>> {
    
    try {      
      let updateRoleDto: UpdateRoleDto = {};
      updateRoleDto.id = id;
      updateRoleDto = {...updateRoleDto, ...createRoleDto} 
      const response = await this.roleService.update(id, updateRoleDto);
      return {
      success: true,
      ...response,       
      }
    } catch (error) {
      throw  new ExceptionsHandler(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @UseInterceptors(ExceptionInterceptor)
  @ApiOperation({ summary: 'Delete the Role', description: 'Delete the Role' })
  async remove(@Param('id') id: string): Promise<ApiResponse<UpdateRoleDto>> {
    try {
      const response = await this.roleService.remove(id);
      return {
        success: true,
        ...response,       
      }
    } catch (error) {
      throw  new ExceptionsHandler(error)
    }
  }


}
