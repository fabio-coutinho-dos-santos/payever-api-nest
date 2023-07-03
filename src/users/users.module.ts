import { Module } from '@nestjs/common';
import { UserSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose'
import { UsersRepository } from './users.repository';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name: 'User', schema: UserSchema}
      
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, MailService],
  exports:[UsersService]
})
export class UsersModule {}
