import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema'
import { hashSync } from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { UsersRepository } from './users.repository';
import { Model, PaginateOptions, PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { omit } from 'lodash'
import axios from 'axios';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { resolve } from 'path';
import { rejects } from 'assert';
import { createHash } from 'crypto';

@Injectable()
export class UsersService {

    constructor(
        private readonly usersRepository: UsersRepository,
        ){}


    async getById(id: number){

        try{
            return await this.getUserInReqresServer(id)
        }catch(e){
            console.log(e);
            if(e.response.status == 404){
                const user = await this.usersRepository.findOne({id});
                if(!user) throw new NotFoundException('User not found');
                return omit(user.toJSON(), '__v', '_id')
            }
        }
    }

    async getUserInReqresServer(id){
        const userInReqIn = await axios.get(`https://reqres.in/api/users/${id}`);
        console.log(userInReqIn.status);
        if(userInReqIn) return userInReqIn.data.data;
    }

    async create(user:User, image: Express.Multer.File){
        try{
            user.id = Math.floor(Math.random() * (10000000000 - 1 + 1)) + 1;
            const userCreated = await this.usersRepository.create(user)
           
            const hash = this.buildHash(userCreated._id.toString());
            console.log(hash);
            await this.storeImage(image, userCreated.id, hash)

            userCreated.avatar = userCreated.id + '-' + hash;
            const userUpdated = await this.usersRepository.findOneAndUpdate({_id: userCreated._id}, userCreated)

            return omit(userUpdated.toJSON(), '__v', '_id')
            
        }catch(e){
            console.log(e);
            throw new InternalServerErrorException('Error on create a new user')
        }
    }

    async storeImage(image, userId, hash){
        return new Promise((resolve, reject) => {
            const destinationFolder = './uploads';
            const filePath = `${destinationFolder}/${userId}-${hash}.png`;
            const writeStream = fs.createWriteStream(filePath);
            writeStream.write(image.buffer);
            writeStream.end();
        
            writeStream.on('finish', () => {
                resolve('stored')
            });

            writeStream.on('error', (error) => {
                reject(error)
            });
        })
    }

    private buildHash(input: string): string {
        const hash = createHash('sha256'); // Specify the hashing algorithm here (e.g., 'sha256', 'md5', etc.)
        hash.update(input);
        return hash.digest('hex');
      }

    async delete(id){
        const userStored: any = await this.getById(id);
        return await this.usersRepository.deleteMany({_id: userStored._id});
    }

}
