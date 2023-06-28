import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserSwagger } from 'src/users/swagger/create-user.swagger';
import { BadRequestSwagger } from 'src/users/swagger/bad-request.swagger';
import { AuthLoginSwagger } from './swagger/auth-login-swagger';
import { AuthLoginDto } from './dto/auth-login-dto';

@Controller('/api/auth')
export class AuthController {

    constructor (private readonly authService: AuthService){}

    @UseGuards(AuthGuard('local'))
    @ApiOperation({summary:'Create a new user'})
    @ApiResponse({status:201, description: 'User created succesfully', type: CreateUserSwagger})
    @ApiResponse({status:400, description: 'Invalid Parameters', type: BadRequestSwagger})
    @Post('login')
    async login(@Body() body: AuthLoginDto):Promise<any>{
        return await this.authService.login(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Post('validateToken')
    async validateToken(@Req() req:any){
        return await this.authService.validateToken(req.user);
    }

}
