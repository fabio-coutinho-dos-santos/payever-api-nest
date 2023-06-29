import { avatarStub } from "../tests/stubs/avatar.stub";
import { userStub } from "../tests/stubs/user.stub";

export const UsersService = jest.fn().mockReturnValue({
    getById: jest.fn().mockResolvedValue(userStub()),
    getUserAvatar: jest.fn().mockResolvedValue(avatarStub),
    create: jest.fn().mockResolvedValue(userStub()),
    update: jest.fn().mockResolvedValue(userStub()),
    delete: jest.fn().mockResolvedValue({
        userDeleted: true,
        avatarDeletd: true
    }),
})