import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compareSync } from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login-dto';

@Injectable()
export class AuthService {

    private TIME_EXPIRATION_ACCESS_TOKEN = '3d';
    private TIME_EXPIRATION_REFRESH_TOKEN = '30d';

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
        ){}

    async login(body: AuthLoginDto){
        const email = body.email;
        const password = body.password
        const user = await this.validateUser(email, password);
        
        if(!user){
            throw new UnauthorizedException('Invalid email or password')
        }
        
        const tokens = await this.getTokens(user._id, user.email);
        return tokens;
    }

    async validateToken(user){
        const payload = { sub: user.id, email: user.email }
        const token = this.jwtService.sign(payload)
        return{valid: true}
    }

    async validateUser(email: string, password: string){
       
        let user : any

        try{
            user = await this.userService.getByEmail(email)
        }catch (error){
            return null;
        }

        const isPasswordValid = compareSync(password, user.password)
        if(isPasswordValid){
            return user;
        }else{
            return null;
        }
        
    }

    async getTokens(userId: string, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
          this.jwtService.signAsync(
            {
              sub: userId,
              email: email,
            },
            {
              expiresIn: this.TIME_EXPIRATION_ACCESS_TOKEN
            },
          ),
          this.jwtService.signAsync(
            {
              sub: userId,
              email: email,
            },
            {
              expiresIn: this.TIME_EXPIRATION_REFRESH_TOKEN
            },
          ),
        ]);

        return {
            accessToken,
            refreshToken,
          };
    }

}
