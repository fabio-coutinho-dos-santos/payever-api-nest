import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../schema/user.schema';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { userStub } from './stubs/user.stub';

jest.mock('../users.service');

describe('UsersController', () => {
  let controller: UsersController;
  let usersServices: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersServices = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

 
  describe('getUser', () => {
    describe('when getUserByUuid is called', () => {

      let user: User;
      
      beforeEach(async () => {
        const user = await controller.getById(userStub().userUuid)
      })

      test('then it should call usersService', () => {
        expect(usersServices.getById).toBeCalledWith(userStub().userUuid);
      })
    })
  })
});
