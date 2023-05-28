import { MockModel } from "../../../database/test/support/mock.model";
import { User } from "../../schema/user.schema";
import { userStub } from "../stubs/user.stub";

export class UsersModel extends MockModel<User>{
    protected entityStub = userStub();
}