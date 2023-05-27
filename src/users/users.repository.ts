import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schema/user.schema";
import { hashSync } from 'bcrypt'

@Injectable()
export class UsersRepository
{
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>){}

    async create(user: User): Promise<User> {
        const newUser = new this.userModel(user);
        return newUser.save();
    }

    async getById(id: string) : Promise<User> {
        return await this.userModel.findOne({userId: id}).exec();
    }

    async getByEmail(email: string) : Promise<User> {
        return await this.userModel.findOne({email: email}).exec();
    }

    async getAll() : Promise<User[]> {
        return await this.userModel.find().exec();
        // return await this.userModel.find().skip(5).limit(2)
    }

    async delete(id): Promise<unknown> {
        return this.userModel.deleteOne({_id:id}).exec();
    }

    async update(id, user): Promise <User> {
        if(user.passport){
            let hashPassword = hashSync(user.password,10)
            user.password = hashPassword;
        }
        await this.userModel.updateOne({_id:id},user).exec();
        return this.getById(user.id);
    }
}