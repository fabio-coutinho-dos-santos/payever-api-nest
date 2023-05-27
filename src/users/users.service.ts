import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './schema/user.schema'
import { hashSync } from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { UsersRepository } from './users.repository';
@Injectable()
export class UsersService {

    constructor(private readonly usersRepository: UsersRepository){}

    async getAll(){
        return await this.usersRepository.getAll();
    }

    async getById(id:string){
        return await this.usersRepository.getById(id)
    }

    async getByEmail(email:string){
        console.log(email)
        return await this.usersRepository.getByEmail(email)
    }

    async create(user:User){
        let hashPassword = hashSync(user.password,10)
        user.password = hashPassword;
        user.userUuid = uuidv4();
        return await this.usersRepository.create(user)
    }

    async update(id:string, user:User){
        return await this.usersRepository.update(id, user)
    }

    async delete(id){
        return this.usersRepository.delete(id);
    }

}
