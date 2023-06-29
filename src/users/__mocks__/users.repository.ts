import { userStub } from "../tests/stubs/user.stub";

let updateUserReponse = {
    id: userStub().id,
    email: userStub().email,
    avatar: userStub().avatar,
    first_name: userStub().first_name,
    last_name: userStub().last_name,
}

export const UsersRepository = jest.fn().mockReturnValue({
    find: jest.fn().mockResolvedValue([userStub()]),
    findLast: jest.fn().mockResolvedValue(userStub()),
    findOne: jest.fn().mockResolvedValue(userStub()),
    findOneAndUpdate: jest.fn().mockResolvedValue(updateUserReponse),
    create: jest.fn().mockResolvedValue(userStub()),
    deleteMany: jest.fn().mockResolvedValue(true)
})