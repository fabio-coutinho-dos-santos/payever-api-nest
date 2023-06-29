import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema'
import { hashSync } from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { UsersRepository } from './users.repository';
import { Model, PaginateOptions, PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { omit } from 'lodash'
@Injectable()
export class UsersService {

    constructor(
        private readonly usersRepository: UsersRepository,
        @InjectModel(User.name) private usersModel: Model<UserDocument>
        ){}


    async getById(id: number){
        const user = await this.usersRepository.findOne({id});
        if(!user) throw new NotFoundException('User not found');
        return user
    }

    async create(user:User){
        try{
            // let hashPassword = hashSync(user.password,10)
            // user.password = hashPassword;
            user.id = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
            console.log(user)
            const userCreated = await this.usersRepository.create(user)
            return omit(userCreated.toJSON(), '__v', '_id')

        }catch(e){
            console.log(e);
            throw new InternalServerErrorException('Error on create a new user')
        }
        
    }

    async delete(id){
        const userStored: any = await this.getById(id);
        return await this.usersRepository.deleteMany({_id: userStored._id});
    }

}
