import { Controller, Get } from '@nestjs/common';
import { User } from './shared/user';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {

    constructor(private readonly usersService:UsersService){}

    @Get()
    async getAll() : Promise<User[]> {
        return this.usersService.getAll();
    }

}
