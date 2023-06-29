import { getModelToken } from "@nestjs/mongoose"
import { Test } from "@nestjs/testing"
import { User } from "../schema/user.schema"
import { userStub } from "./stubs/user.stub"
import { UsersModel } from "./support/users.model"
import { UsersRepository } from "../users.repository"
import { FilterQuery } from "mongoose"

describe('UsersRepository', () => {

    let usersRepository: UsersRepository;

    describe('find Operations', () => {
        let usersModel: UsersModel
        let userfilterQuery: FilterQuery<User>

        beforeEach( async () => {
            const moduleRef = await Test.createTestingModule({
                providers:[
                    UsersRepository,{
                        provide: getModelToken(User.name)
                        , useClass: UsersModel
                    }
                ]
            }).compile();

            usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
            usersModel = moduleRef.get<UsersModel>(getModelToken(User.name));
            userfilterQuery = {id: userStub().id}
            jest.clearAllMocks()
        })

        describe('findOne', () => {
            describe('when findOne is called', () => {

                let user:User;

                beforeEach( async () => {
                    jest.spyOn(usersModel, 'findOne');
                    user = await usersRepository.findOne(userfilterQuery)
                })

                test('then it should call the userModel', () => {
                    expect(usersModel.findOne).toHaveBeenLastCalledWith(userfilterQuery)
                })

                test('then it shold return a user', () => {
                    expect(user).toEqual(userStub())
                })

            })
        })

        describe('find', () => {
            describe('when find is called', () => {

                let users:User[]

                beforeEach( async () =>{
                    jest.spyOn(usersModel, 'find')
                    users = await usersRepository.find()
                })

                test('then it shoul call the userModel', () => {
                    expect(usersModel.find).toHaveBeenCalled()
                })

                test('then it shold return a user array', () => {
                    expect(users).toEqual([userStub()])
                })
            })
        })

        describe('findOneAndUpdate', () => {
            describe('when findOneAndUpdate is called', () => {
                let user: User;
        
                beforeEach(async () => {
                    jest.spyOn(usersModel, 'findOneAndUpdate');
                    user = await usersRepository.findOneAndUpdate(userfilterQuery, userStub().avatar);
                })
        
                test('then it should call the userModel', () => {
                    expect(usersModel.findOneAndUpdate).toHaveBeenCalledWith(userfilterQuery, userStub().avatar, { new: true });
                })
        
                test('then it should return a user', () => {
                    expect(user).toEqual(userStub());
                })

            })
        })
    })

    describe('create operations', () => {
        beforeEach(async () => {
            const moduleRef = await Test.createTestingModule({
              providers: [
                UsersRepository,
                {
                  provide: getModelToken(User.name),
                  useValue: UsersModel,
                },
              ],
            }).compile();
      
            usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
          });
      
        describe('create', () => {
        describe('when create is called', () => {
            let user: User;
            let saveSpy: jest.SpyInstance;
            let constructorSpy: jest.SpyInstance;
    
            beforeEach(async () => {
            saveSpy = jest.spyOn(UsersModel.prototype, 'save');
            constructorSpy = jest.spyOn(UsersModel.prototype, 'constructorSpy');
            user = await usersRepository.create(userStub());
            })
    
            test('then it should call the userModel', () => {
            expect(saveSpy).toHaveBeenCalled();
            expect(constructorSpy).toHaveBeenCalledWith(userStub())
            })
    
            test('then it should return a user', () => {
            expect(user).toEqual(userStub());
            })
        })
        })
    })
})







