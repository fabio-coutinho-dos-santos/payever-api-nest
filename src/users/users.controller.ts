import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseFilters, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { ShowUserSwagger } from './swagger/show-user.swagger';
import { CreateUserSwagger } from './swagger/create-user.swagger';
import { UpdateUserSwagger } from './swagger/update-user.swagger';
import { BadRequestSwagger } from './swagger/bad-request.swagger';
import { NotFundSwagger } from './swagger/not-found.swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from './schema/user.schema';
import { HttpExceptionFilter } from './filters/http-exception.filters';

// @UseGuards(AuthGuard('jwt'))
@Controller('api/users')
@ApiTags('Users')
@UseFilters(HttpExceptionFilter)
// @ApiBearerAuth()

export class UsersController {
    constructor(private readonly usersService:UsersService){}

    @Get()
    @ApiOperation({summary:'Get all Users'})
    @ApiResponse({
        status:200 , 
        description: 'Get all Users', 
        type: ShowUserSwagger,
        isArray:true
    })
    getAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ) {
        return this.usersService.paginate({
                page:page,
                limit:limit,
                sort: { email: 1},
            }
        );
    }

    @Get(':uuid')
    @ApiOperation({summary:'Get users by uuid'})
    @ApiResponse({status:200, description: 'User found',type: ShowUserSwagger})
    @ApiResponse({status:404, description: 'User not found', type: NotFundSwagger})
    async getById( @Param('uuid') id:string ) : Promise<User> {
        return await this.usersService.getById(id)
    }

    @Get('email/:email')
    @ApiOperation({summary:'Get users by email'})
    @ApiResponse({status:200, description: 'User found',type: ShowUserSwagger})
    @ApiResponse({status:404, description: 'User not found', type: NotFundSwagger})
    async getByEmail( @Param('email') email:string ) : Promise<User> {
        return await this.usersService.getByEmail(email)
    }

    @Post()
    @ApiOperation({summary:'Create a new user'})
    @ApiResponse({status:201, description: 'User created succesfully', type: CreateUserSwagger})
    @ApiResponse({status:400, description: 'Invalid Parameters', type: BadRequestSwagger})
    async create ( @Body() body: CreateUserDto ) : Promise <User> {
        return await this.usersService.create(body);
    }

    @Patch(':uuid')
    @ApiOperation({summary:'Update a user'})
    @ApiResponse({status:200 , description: 'User updated succesfully', type: UpdateUserSwagger})
    @ApiResponse({status:404 , description: 'User not found', type: NotFundSwagger})
    async update ( @Param('uuid') uuid:string, @Body() body:UpdateUserDto ) : Promise <User> {
        return await this.usersService.update(uuid,body)
    }

    @Delete(':uuid')
    @ApiOperation({summary:'Delete a user'})
    @ApiResponse({status:204 , description: 'User deleted succesfully'})
    @ApiResponse({status:404 , description: 'User not found', type: NotFundSwagger})
    async delete ( @Param('uuid') uuid:string ) {
        return await this.usersService.delete(uuid);
    } 

}
