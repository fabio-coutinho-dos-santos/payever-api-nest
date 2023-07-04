import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ShowUserSwagger } from './swagger/show-user.swagger';
import { CreateUserSwagger } from './swagger/create-user.swagger';
import { BadRequestSwagger } from './swagger/bad-request.swagger';
import { NotFundSwagger } from './swagger/not-found.swagger';
import { User } from './schema/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteUserSwagger } from './swagger/delete-user-swagger';
import { GetAvatarSwagger } from './swagger/get-avatar.swagger';
@Controller('api/users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get users by uuid' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: ShowUserSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFundSwagger,
  })
  async getById(@Param('id') id: number): Promise<User> {
    return await this.usersService.getById(id);
  }

  @Get(':id/avatar')
  @ApiOperation({ summary: 'Get avatar user' })
  @ApiResponse({
    status: 200,
    description: 'Get avatar',
    type: GetAvatarSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFundSwagger,
  })
  async getAvatar(@Param('id') id: number): Promise<User | unknown> {
    return await this.usersService.getUserAvatar(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created succesfully',
    type: CreateUserSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Parameters',
    type: BadRequestSwagger,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test.test@hotmail.com' },
        first_name: { type: 'string', example: 'Josh' },
        last_name: { type: 'string', example: 'Robertson' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() body,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<User> {
    return await this.usersService.create(body, image);
  }

  @Delete(':id/avatar')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'User deleted succesfully',
    type: DeleteUserSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFundSwagger,
  })
  async delete(@Param('id') id: number) {
    return await this.usersService.delete(id);
  }
}
