import { userStub } from "../tests/stubs/user.stub";
import { hashSync } from 'bcrypt'

let updateUserReponse = {
    userUuid: userStub().userUuid,
    email: userStub().email,
    favoriteBrands: userStub().favoriteBrands,
    password: hashSync(userStub().password,10)
}

export const UsersRepository = jest.fn().mockReturnValue({
    find: jest.fn().mockResolvedValue([userStub()]),
    findOne: jest.fn().mockResolvedValue(userStub()),
    findOneAndUpdate: jest.fn().mockResolvedValue(updateUserReponse),
    create: jest.fn().mockResolvedValue(userStub()),
    deleteMany: jest.fn().mockResolvedValue(true)
})