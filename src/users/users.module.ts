import { Module } from '@nestjs/common';
import { UserSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose'
import { UsersRepository } from './users.repository';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name: 'User', schema: UserSchema}
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports:[UsersService]
})
export class UsersModule {}
