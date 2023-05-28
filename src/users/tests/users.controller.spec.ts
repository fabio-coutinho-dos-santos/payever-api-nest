import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../schema/user.schema';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { userStub } from './stubs/user.stub';

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
  });

 
  describe('getUser', () => {
    describe('when getUserByUuid is called', () => {

      let user: User;
      beforeEach(async () => {
        user = await usersController.getById(userStub().userUuid)
      })

      test('then it should call usersService', () => {
        expect(usersServices.getById).toBeCalledWith(userStub().userUuid);
      })

      test('then should return a user', () => {
        expect(user).toEqual(userStub())
      })
    })

    describe('when getUserByEmail is called' , () => {

      let user;

      beforeEach(async () => {
        user = await usersServices.getByEmail(userStub().email)
      })

      test('then it should call userService' , () => {
        expect(usersServices.getByEmail).toBeCalledWith(userStub().email);
      })

      test('then should return a user', () => {
        expect(user).toEqual(userStub())
      })

    })
  })

  describe('getUsers', () => {
    describe('when getUsers is called', () => {
      let users: User[];

      beforeEach(async () => {
        users = await usersController.getAll();
        console.log(users);
      })

      test('then it should call usersService', () => {
        expect(usersServices.getAll).toHaveBeenCalled();
      })

      test('then it should return users', () => {
        expect(users).toEqual([userStub()])
      })
    })
  })

  describe('createUser', () => {
    describe('when create user is called' , () => {

      let user:User
      let createUserDto: CreateUserDto

      beforeEach( async () => {
        user = await usersServices.create(createUserDto);
      })

      test('then it should call usersServices' , () => {
        expect(usersServices.create).toHaveBeenCalledWith(createUserDto)
      })

      test('then should return a user ', () => {
        expect(user).toEqual(userStub())
      })

    })
  })

  describe('updateUser', () => {
    describe('when update user is called' , () => {

      let user:User
      let updateUserDto: any = {
        favoriteBrands: ['coca-cola']
      }

      beforeEach( async () => {
        user = await usersServices.update(userStub().userUuid, updateUserDto);
      })

      test('then it should call usersServices' , () => {
        expect(usersServices.update).toHaveBeenCalledWith(userStub().userUuid, updateUserDto)
      })

      test('then should return a user ', () => {
        expect(user).toEqual(userStub())
      })

    })
  })

  describe('deleteUser' , () => {

    describe('when delete user is called' , () => {
      let result: boolean

      beforeEach( async () => {
        result = await usersServices.delete(userStub().userUuid);
      })

      test('then it should call usersServices' , () => {
        expect(usersServices.delete).toHaveBeenCalledWith(userStub().userUuid)
      })

      test('then shold return true', () => {
        expect(result).toEqual(true)
      })

    })
  })

});
