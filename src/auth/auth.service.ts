import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compareSync } from 'bcrypt'

@Injectable()
export class AuthService {

    constructor(private readonly userService: UsersService){}

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
