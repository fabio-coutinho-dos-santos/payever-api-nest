import { userStub } from "../tests/stubs/user.stub";

export const UsersService = jest.fn().mockReturnValue({

    getById: jest.fn().mockResolvedValue(userStub()),
    getByEmail: jest.fn().mockResolvedValue(userStub()),
    create: jest.fn().mockResolvedValue(userStub()),
    update: jest.fn().mockResolvedValue(userStub()),
    getAll: jest.fn().mockResolvedValue([userStub()]),
    delete: jest.fn().mockReturnValue(true)

})