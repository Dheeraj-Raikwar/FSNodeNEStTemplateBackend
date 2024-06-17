/* Importing NestJS Packages */
import { Controller, Body, Post, Get, UseGuards, Query, Param, Delete, Patch, UseInterceptors } from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { ApiOperation } from '@nestjs/swagger';
/* Importing Util services */
import { ApiResponse } from 'src/utils/types/common';
import { Filters } from 'src/utils/types/filters';
import { ExceptionInterceptor } from 'src/utils/types/Exception';
/* Imprting Permission services */
import { PermissionService } from './permission.service';
import { PermissionDto } from './dto/PermissionDto';
import { CreatePermissionDto } from './dto/createPermissionDto';
import { AuthGuard } from '@nestjs/passport';
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @UseInterceptors(ExceptionInterceptor)
  @ApiOperation({ summary: 'Create Permission', description: 'Create Permissions for the resources with actions' })
  async create(@Body() body: CreatePermissionDto): Promise<ApiResponse<PermissionDto>> {
    try {
      const response = await this.permissionService.create(body);
      return {
        success: true,
        ...response,
      }
    } catch (error) {
      throw  new ExceptionsHandler(error)
    }      
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  @UseInterceptors(ExceptionInterceptor)
  @ApiOperation({ summary: 'Get all the Permissions', description: 'Get all Permissions' })
  async findAll(@Query() fileters: Filters): Promise<ApiResponse<PermissionDto[]>> {
    try{
      const response = await this.permissionService.findAll();
      return {
        success: true,
        ...response,
      }
    } catch(error) {
      throw  new ExceptionsHandler(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @UseInterceptors(ExceptionInterceptor)
  @ApiOperation({ summary: 'Get the Permission by Id', description: 'Get the Permission by Id' })
  async findOne(@Param('id') id: string): Promise<ApiResponse<PermissionDto>> {
    try {
      const response = await this.permissionService.findOneById(id)
      return {
        success: true,
        ...response
      } 
    } catch (error) {
      throw  new ExceptionsHandler(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(ExceptionInterceptor)
  @ApiOperation({ summary: 'Update the Permission by Id', description: 'Update the Permission by Id' })
  async update(@Param('id') id: string, @Body() updateRoleDto: PermissionDto): Promise<ApiResponse<PermissionDto>> {
    try {
      const response = await this.permissionService.update(id, updateRoleDto);
      return {
        success: true,
        ...response
      }    
    } catch (error) {
      throw  new ExceptionsHandler(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @UseInterceptors(ExceptionInterceptor)
  @ApiOperation({ summary: 'Update the Permission by Id', description: 'Update the Permission by Id' })
  async remove(@Param('id') id: string): Promise<ApiResponse<PermissionDto>>  {
    try {
      const response = await this.permissionService.remove(id);
      return {
        success: true,
        ...response        
      }
    } catch (error) {
      throw  new ExceptionsHandler(error)
    }    
  }
}
