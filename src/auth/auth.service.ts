import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compareSync } from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
        ){}

    async login(user){
        const payload = { sub: user.id, email: user.email }

        return{
            token: this.jwtService.sign(payload)
        }
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

}
