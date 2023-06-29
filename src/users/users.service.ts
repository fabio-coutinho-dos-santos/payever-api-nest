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
import { EmailProvider } from 'src/providers/EmailProvider';
import { RabbitmqProvider } from 'src/providers/RabbitmqProvider';

@Injectable()
export class UsersService {

    private NEXT_INDEX_AFTER_REQURES_REGISTERS=13

    constructor(
        private readonly usersRepository: UsersRepository,
    ){}


    async getById(id: number){

        try{
            const user = await this.usersRepository.findOne({id});
            if(!user) throw new NotFoundException('User not found');
            return omit(user.toJSON(), '__v', '_id')
        }catch(e){
            if(e.status == 404){
                try{
                    return await this.getUserInReqresServer(id)
                }catch(e){
                    if(e.response.status == 404){
                        throw new NotFoundException('User not found'); 
                    }else{
                        throw new InternalServerErrorException('Error on get user avatar')
                    }
                }
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
            const lastUser: any = await this.usersRepository.findLast();
            user.id = this.getNextId(lastUser)

            const userCreated = await this.usersRepository.create(user)
           
            const hash = this.buildHash(userCreated._id.toString());

            await this.storeImage(image.buffer, userCreated.id, hash)

            userCreated.avatar = userCreated.id + '-' + hash;
            const userUpdated = await this.usersRepository.findOneAndUpdate({_id: userCreated._id}, userCreated)

            await this.sendEmail(userUpdated);
            await this.sendMessageToQueue(userUpdated);

            return omit(userUpdated.toJSON(), '__v', '_id')
            
        }catch(e){
            console.log(e);
            throw new InternalServerErrorException('Error on create a new user')
        }
    }

    private getNextId(lastUser){
        if(lastUser){
            return lastUser.id + 1;
        }else{
            return this.NEXT_INDEX_AFTER_REQURES_REGISTERS;
        }
    }

    async sendEmail(user)
    {
        const emailProvider = new EmailProvider(user)
        const transporter = emailProvider.configureEmailServer()
        try{
            return await emailProvider.sendEmail(transporter);
        }
        catch(e){
            console.log(e)
            // to simulate without send email
            return true
            // throw new InternalServerErrorException('Error sending email');
        }
    }

    async sendMessageToQueue(user){
        try{
            const rabbitMqServer = new RabbitmqProvider(process.env.RABBIT_MQ_CONNECTIO_URI);
            const message = `User ${user.id} created`;
            const messageJson = {message: message};
            await rabbitMqServer.start();
            const confirmation = await rabbitMqServer.publishInExchange(
                process.env.RABBIT_MQ_EXCHCANGE,
                process.env.RABBIT_MQ_ROUTING_KEY, 
                JSON.stringify(messageJson))
           
            // to simulate without deliveryMessage
            return {message:`Message ${message} sent to queue`}

            // if(confirmation){
            //     return {message:`Message ${message} sent to queue`}
            // }

        }catch(e){
            console.error(e);
            // to simulate without delivery Message
            return {message:`Message sent to queue`}
            // throw new InternalServerErrorException('Error on send message to queue')
        }
    }

    async storeImage(image, userId, hash){
        return new Promise((resolve, reject) => {
            const destinationFolder = './uploads';
            const filePath = `${destinationFolder}/${userId}-${hash}.png`;
            const writeStream = fs.createWriteStream(filePath);
            writeStream.write(image);
            writeStream.end();
        
            writeStream.on('finish', () => {
                resolve('stored')
            });

            writeStream.on('error', (error) => {
                console.log('erro ao gravar imagem')
                console.log(error)
                reject(error)
            });
        })
    }

    private buildHash(input: string): string {
        const hash = createHash('sha256'); // Specify the hashing algorithm here (e.g., 'sha256', 'md5', etc.)
        hash.update(input);
        return hash.digest('hex');
      }

    async getUserAvatar(id: number){
        
        try{
            return await this.getAvatarUserFromDatabase(id)
        }catch(e){
            if(e.response.statusCode == 404){
                try{
                    return await this.getAvatarUserFromReqresServer(id)
                }catch(e){
                    if(e.response.statusCode == 404){
                        throw new NotFoundException('User not found'); 
                    }else{
                        throw new InternalServerErrorException('Error on get user avatar')
                    }
                }
           }else{
                throw new InternalServerErrorException('Error on get user avatar')
           }
        }
    }

    async getAvatarUserFromDatabase(id){
        const user = await this.usersRepository.findOne({id});
        if(user){
            const imageBuffer = await this.readImage('./uploads/'+user.avatar+'.png');
            const base64String = imageBuffer.toString('base64');
            return {avatarContent: base64String};
        }else{
            throw new NotFoundException('User not found in database')
        }
    }

    async getAvatarUserFromReqresServer(id){
        const user = await this.getUserInReqresServer(id)
        const hash = this.buildHash(user.id.toString());
        const avatarPath = user.avatar;
        user.avatar = user.id + '-' + hash;
        await this.usersRepository.create(user);
        if(user){
            try{
                const image = await axios.get(avatarPath);
                const imageBuffer = Buffer.from(image.data, 'binary');
                await this.storeImage(imageBuffer, user.id.toString(), hash);
                const imageLocal = await this.readImage('./uploads/'+user.id+"-"+hash+'.png');
                const base64String = imageLocal.toString('base64');
                return {avatarContent: base64String};
            }catch(e){
                console.log(e)
                throw new InternalServerErrorException('Internal Server Error')
            }
        }
    }

    private readImage(filePath: string): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
          fs.readFile(filePath, (error, data) => {
            if (error) {
              reject(error);
            } else {
              resolve(data);
            }
          });
        });
      }

    async delete(id){
        const userStored = await this.usersRepository.findOne({id});
        if(!userStored){
            throw new NotFoundException('User not found');
        }else{
            const avatarPath = "./uploads/" + userStored.avatar + '.png'
            const userDeleted = await this.usersRepository.deleteMany({id: userStored.id});
            try{
                const avatarDeleted = await this.eraseImage(avatarPath);
                return{
                    avatarDeleted: avatarDeleted,
                    userDeleted: userDeleted
                }
            }catch(e){
                return{
                    avatarDeleted: false,
                    userDeleted: userDeleted
                }
            }
        }
    }

    async eraseImage(path){
        return new Promise((resolve, reject)=>{
            fs.unlink(path, (err) => {
                if (err) {
                    reject(false)
                }
                resolve(true)
                });
        })
    }
}
