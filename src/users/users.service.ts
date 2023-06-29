import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from './schema/user.schema'
import { UsersRepository } from './users.repository';
import { omit } from 'lodash'
import axios from 'axios';
import * as fs from 'fs';
import { createHash } from 'crypto';
import { EmailProvider } from '../providers/EmailProvider';
import { RabbitmqProvider } from '../providers/RabbitmqProvider';

@Injectable()
export class UsersService {

    private NEXT_INDEX_AFTER_REQURES_REGISTERS = 13
    private USER_NOT_FOUND_MESSSAGE = 'User not found';
    private ERROR_ON_GET_USER_AVATAR = 'Error on get user avatar'
    private INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error'
    private ERROR_ON_CREATE_NEW_USER_MESSAGE = 'Error on create a new user'
    private BAD_REQUEST_IMAGE = 'An image must be uploaded'
    private BAD_REQUEST_FIELDS = 'email, first_name and last_name are required fields'
    private EMAIL_USED = 'This email is already in use'
    private REQRES_BASE_URL = 'https://reqres.in/api/users'
    private UPLOAD_FOLDER_PATH = './uploads';
    private STATUS_CODE_NOT_FOUND = 404;

    constructor(
        private readonly usersRepository: UsersRepository,
    ){}


    async getById(id: number){

        try{
            const user = await this.usersRepository.findOne({id});
            if(!user) throw new NotFoundException(this.USER_NOT_FOUND_MESSSAGE);
            return omit(user.toJSON(), '__v', '_id')
        }catch(e){
            if(e.status == this.STATUS_CODE_NOT_FOUND){
                try{
                    return await this.getUserInReqresServer(id)
                }catch(e){
                    if(e.response.status == this.STATUS_CODE_NOT_FOUND){
                        throw new NotFoundException(this.USER_NOT_FOUND_MESSSAGE); 
                    }else{
                        throw new InternalServerErrorException(this.ERROR_ON_GET_USER_AVATAR)
                    }
                }
            }
        }
    }

    async getUserInReqresServer(id){
        const userInReqIn = await axios.get(`${this.REQRES_BASE_URL}/${id}`);
        if(userInReqIn) return userInReqIn.data.data;
    }

    async create(user:User, image: Express.Multer.File){
        if(!image){
            throw new BadRequestException(this.BAD_REQUEST_IMAGE)
        }

        await this.validateUserSchema(user);
        
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
            throw new InternalServerErrorException(this.ERROR_ON_CREATE_NEW_USER_MESSAGE)
        }
    }

    async validateUserSchema(user){
        if(!user.email || !user.first_name || !user.last_name){
            throw new BadRequestException(this.BAD_REQUEST_FIELDS);
        }

        const userStored = await this.usersRepository.findOne({email: user.email})
        if(userStored){
            throw new BadRequestException(this.EMAIL_USED);
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
            const filePath = `${this.UPLOAD_FOLDER_PATH}/${userId}-${hash}.png`;
            const writeStream = fs.createWriteStream(filePath);
            writeStream.write(image);
            writeStream.end();
        
            writeStream.on('finish', () => {
                resolve('stored')
            });

            writeStream.on('error', (error) => {
                console.error(error)
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
            if(e.response.statusCode == this.STATUS_CODE_NOT_FOUND){
                try{
                    return await this.getAvatarUserFromReqresServer(id)
                }catch(e){
                    if(e.response.status == this.STATUS_CODE_NOT_FOUND){
                        throw new NotFoundException(this.USER_NOT_FOUND_MESSSAGE); 
                    }else{
                        throw new InternalServerErrorException(this.ERROR_ON_GET_USER_AVATAR)
                    }
                }
           }else{
                throw new InternalServerErrorException(e.getMessage())
           }
        }
    }

    async getAvatarUserFromDatabase(id){
        const user = await this.usersRepository.findOne({id});
        if(user){
            const imageBuffer = await this.readImage(this.UPLOAD_FOLDER_PATH + '/' + user.avatar + '.png');
            const base64String = imageBuffer.toString('base64');
            return {avatarContent: base64String};
        }else{
            throw new NotFoundException(this.USER_NOT_FOUND_MESSSAGE)
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
                const imageLocal = await this.readImage(this.UPLOAD_FOLDER_PATH + "/" + user.id+ "-" + hash + '.png');
                const base64String = imageLocal.toString('base64');
                return {avatarContent: base64String};
            }catch(e){
                console.log(e)
                throw new InternalServerErrorException(this.INTERNAL_SERVER_ERROR_MESSAGE)
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
            throw new NotFoundException(this.USER_NOT_FOUND_MESSSAGE);
        }else{
            const avatarPath = this.UPLOAD_FOLDER_PATH + "/" + userStored.avatar + '.png'
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
