import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from './dto/create-user.dto';
import { ShowUserSwagger } from './swagger/show-user.swagger';
import { CreateUserSwagger } from './swagger/create-user.swagger';
import { BadRequestSwagger } from './swagger/bad-request.swagger';
import { NotFundSwagger } from './swagger/not-found.swagger';
import { User } from './schema/user.schema';
import { HttpExceptionFilter } from './filters/http-exception.filters';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@Controller('api/users')
@ApiTags('Users')
@UseFilters(HttpExceptionFilter)

export class UsersController {
    constructor(private readonly usersService:UsersService){}

    @Get(':id')
    @ApiOperation({summary:'Get users by uuid'})
    @ApiResponse({status:200, description: 'User found',type: ShowUserSwagger})
    @ApiResponse({status:404, description: 'User not found', type: NotFundSwagger})
    async getById( @Param('id') id:number ) : Promise<User> {
        return await this.usersService.getById(id)
    }

    @Get(':id/avatar')
    @ApiOperation({summary:'Get avatar user'})
    async getAvatar( @Param('id') id:number ) : Promise<User | unknown> {
        return await this.usersService.getUserAvatar(id)
    }

    @Post()
    @ApiOperation({summary:'Create a new user'})
    @ApiResponse({status:201, description: 'User created succesfully', type: CreateUserSwagger})
    @ApiResponse({status:400, description: 'Invalid Parameters', type: BadRequestSwagger})
    @UseInterceptors(FileInterceptor('image'))
    async create ( @Body() body, @UploadedFile() image: Express.Multer.File ) : Promise <User> {
        return await this.usersService.create(body, image);
    }

    @Delete(':id/avatar')
    @ApiOperation({summary:'Delete a user'})
    @ApiResponse({status:204 , description: 'User deleted succesfully'})
    @ApiResponse({status:404 , description: 'User not found', type: NotFundSwagger})
    async delete ( @Param('id') id:number ) {
        return await this.usersService.delete(id);
    } 

}
