import { Test, TestingModule } from '@nestjs/testing';
import { FilterQuery } from 'mongoose';
import { User } from '../schema/user.schema';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';
import { userStub } from './stubs/user.stub';
import { compareSync } from 'bcrypt'
import { CreateUserDto } from '../dto/create-user.dto';

jest.mock('../users.repository');

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  let userUuidFilter: FilterQuery<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRepository],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    userUuidFilter = {userUuid: userStub().userUuid}
    jest.clearAllMocks();
  });

  describe('find', () => {
    
    describe('when find is called', () => {

      let users: User[];

      beforeEach( async () => {
        users = await usersRepository.find();
      })
      
      test('then should call the usersRepository', () => {
        expect(usersRepository.find).toHaveBeenCalled();
      })

      test('then should return a user array', () => {
        expect(users).toEqual([userStub()]);
      })

     })
  })

  describe('findOne', () => {
    
    describe('when findOne is called', () => {

      let user: User;

      beforeEach( async () => {
        user = await usersRepository.findOne(userUuidFilter);
      })
      
      test('then should call the usersRepository', () => {
        expect(usersRepository.findOne).toHaveBeenCalledWith(userUuidFilter);
      })

      test('then should return a user', () => {
        expect(user).toEqual(userStub());
      })

     })
  })

  describe('findOneAndUpdate', () => {
    
    describe('when findOneAndUpdate is called', () => {

      let user: User;
      let updateUserDto: any = {
        password: 'teste',
        favoriteBrands: ['coca-cola']
      }

      beforeEach( async () => {
        user = await usersRepository.findOneAndUpdate(userUuidFilter, updateUserDto);
      })
      
      test('then should call the usersRepository', () => {
        expect(usersRepository.findOneAndUpdate).toHaveBeenCalledWith(userUuidFilter, updateUserDto);
      })

      test('then should return a user', () => {
        let comparison = compareSync(userStub().password, user.password)
        expect(user.email).toEqual(userStub().email)
        expect(user.userUuid).toEqual(userStub().userUuid)
        expect(user.favoriteBrands).toEqual(userStub().favoriteBrands)
        expect(comparison).toEqual(true)
      })

     })
  })

  describe('create', () => {
    
    describe('when create is called', () => {

      let user: User
      let createUserDto: CreateUserDto

      beforeEach( async () => {
        user = await usersRepository.create(createUserDto);
      })
      
      test('then should call the usersRepository', () => {
        expect(usersRepository.create).toHaveBeenCalledWith(createUserDto);
      })

      test('then should return a user', () => {
        expect(user).toEqual(userStub());
      })

     })
  })

  describe('deleteMany', () => {
    
    describe('when deleteMany is called', () => {

      let response: boolean

      beforeEach( async () => {
        response = await usersRepository.deleteMany(userUuidFilter);
      })
      
      test('then should call the usersRepository', () => {
        expect(usersRepository.deleteMany).toHaveBeenCalledWith(userUuidFilter);
      })

      test('then should return a user', () => {
        expect(response).toEqual(true);
      })

     })
  })
});
