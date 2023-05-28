import { Test } from "@nestjs/testing"
import { Connection } from "mongoose"
import { AppModule } from "src/app.module"
import { DatabaseService } from "src/database/database.service";
import { userStub } from "../stubs/user.stub";

describe('UsersController' , () => {

    let dbConnection: Connection;

    beforeAll( async () => {
        const moduleRef = await Test.createTestingModule({
            imports:[AppModule]
        }).compile()

        const app = moduleRef.createNestApplication();
        await app.init();

        dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();

        describe('getUsers', async () => {
            await dbConnection.collection('users').insertOne(userStub());
        })
    })
})