import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../schema/user.schema';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { userStub } from './stubs/user.stub';
import { avatarStub } from './stubs/avatar.stub';

jest.mock('../users.service');

describe('UsersController', () => {
  let usersController: UsersController;
  let usersServices: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService]
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersServices = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  })

  describe('getUser', () => {
    describe('when getUserById is called', () => {
  
      let user: any;
      beforeEach(async () => {
        user = await usersController.getById(userStub().id)
      })
  
      test('then it should call usersService', () => {
        expect(usersServices.getById).toBeCalledWith(userStub().id);
      })
  
      test('then should return a user', () => {
        expect(user).toEqual(userStub())
      })
    })
})

describe('getUserAvatar', () => {
  describe('when getUserAvatar is called', () => {

    let avatarContent: any;
    beforeEach(async () => {
      avatarContent = await usersController.getAvatar(userStub().id)
    })

    test('then it should call usersService', () => {
      expect(usersServices.getUserAvatar).toBeCalledWith(userStub().id);
    })

    test('then should a content in base64', () => {
      expect(avatarContent).toEqual(avatarStub)
    })
  })
})

describe('createUser', () => {
  describe('when create user is called' , () => {

    let user:User
    let image: any
    let createUserDto: CreateUserDto

    beforeEach( async () => {
      user = await usersServices.create(createUserDto, image);
    })

    test('then it should call usersServices' , () => {
      expect(usersServices.create).toHaveBeenCalledWith(createUserDto, image)
    })

    test('then should return a user ', () => {
      expect(user).toEqual(userStub())
    })

  })
})
 
describe('deleteUser' , () => {

  describe('when delete user is called' , () => {
    let result: any = {
      userDeleted: true,
      avatarDeletd: true
    }

    beforeEach( async () => {
      result = await usersServices.delete(userStub().id);
    })

    test('then it should call usersServices' , () => {
      expect(usersServices.delete).toHaveBeenCalledWith(userStub().id)
    })

    test('then shold return true', () => {
      expect(result.userDeleted).toEqual(true)
      expect(result.avatarDeletd).toEqual(true)
    })

  })
})
})
