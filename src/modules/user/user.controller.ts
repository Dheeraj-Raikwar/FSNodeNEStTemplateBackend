/* Importing NestJS Packages */
import { Controller, Body, Post, Patch, Delete, UseGuards, Get, Param, Request, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
/* Importing Util services */
import { UserService } from "./user.service";
import { ExceptionInterceptor } from 'src/utils/types/Exception';
import { ApiResponse, CustomRequest } from 'src/utils/types/common';
import { CreateUserDto } from "./dto/createUser.dto";
import { updateUserDto } from "./dto/updateUser.dto";
import { FilterUserDto } from './dto/filterUser.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(ExceptionInterceptor)
  @ApiOperation({ summary: 'Create User', description: 'Create User with permission and role' })
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<updateUserDto>> {
    try {
      const response =  await this.userService.create(createUserDto);
      return {
        success: true,
        ...response,
      }
    } catch (error) {      
      throw  new ExceptionsHandler(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('all')
  @UseInterceptors(ExceptionInterceptor)
  @ApiOperation({ summary: 'Get all Users', description: 'Get all Users the Roles with permissions' })
  async findAll(@Body() filter : FilterUserDto,@Request() req:CustomRequest): Promise<ApiResponse<CreateUserDto[]>>{
    try{      
      const response =  await this.userService.findAll(filter, req.user.id);
      return {
        success: true,
        ...response,
      }
    } catch(error){
      throw  new ExceptionsHandler(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @UseInterceptors(ExceptionInterceptor)
  @ApiOperation({ summary: 'Get User by Id', description: 'Get the User by Id with permissions and Role' })
  async findOne(@Param('id') id: string): Promise<ApiResponse<updateUserDto>>{
    try {
      const response = await this.userService.findOneById(id);
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
  @ApiOperation({ summary: 'Update the User', description: 'Update the User details' })
  async update(@Param('id') id: string, @Body() creaUserDto: CreateUserDto): Promise<ApiResponse<updateUserDto>> {
    
    try {      
      let updateUserDto: updateUserDto = {};
      updateUserDto.id = id;
      updateUserDto = {...updateUserDto, ...creaUserDto}      
      const response = await this.userService.update(id, updateUserDto);
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
  @ApiOperation({ summary: 'Delete the User', description: 'Delete the User' })
  async remove(@Param('id') id: string): Promise<ApiResponse<updateUserDto>> {
    try {
      const response = await this.userService.remove(id);
      return {
        success: true,
        ...response,       
        }
    } catch (error) {
      throw  new ExceptionsHandler(error)
    }
  }

}
