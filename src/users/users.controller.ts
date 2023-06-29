import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseFilters, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from './dto/create-user.dto';
import { ShowUserSwagger } from './swagger/show-user.swagger';
import { CreateUserSwagger } from './swagger/create-user.swagger';
import { BadRequestSwagger } from './swagger/bad-request.swagger';
import { NotFundSwagger } from './swagger/not-found.swagger';
import { User } from './schema/user.schema';
import { HttpExceptionFilter } from './filters/http-exception.filters';

@Controller('api/users')
@ApiTags('Users')
@UseFilters(HttpExceptionFilter)

export class UsersController {
    constructor(private readonly usersService:UsersService){}

    @Get(':id')
    @ApiOperation({summary:'Get users by uuid'})
    @ApiResponse({status:200, description: 'User found',type: ShowUserSwagger})
    @ApiResponse({status:404, description: 'User not found', type: NotFundSwagger})
    async getById( @Param('id') id:number ) : Promise<User | unknown> {
        return await this.usersService.getById(id)
    }

    @Post()
    @ApiOperation({summary:'Create a new user'})
    @ApiResponse({status:201, description: 'User created succesfully', type: CreateUserSwagger})
    @ApiResponse({status:400, description: 'Invalid Parameters', type: BadRequestSwagger})
    async create ( @Body() body: CreateUserDto ) : Promise <User> {
        return await this.usersService.create(body);
    }

    @Delete(':id')
    @ApiOperation({summary:'Delete a user'})
    @ApiResponse({status:204 , description: 'User deleted succesfully'})
    @ApiResponse({status:404 , description: 'User not found', type: NotFundSwagger})
    async delete ( @Param('id') id:string ) {
        return await this.usersService.delete(id);
    } 

}
