import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './shared/user';

@Injectable()
export class UsersService {

    constructor( @InjectModel('User') private readonly userModel: Model<User> ){}

    async getAll(){
        return await this.userModel.find().exec()
    }

}
