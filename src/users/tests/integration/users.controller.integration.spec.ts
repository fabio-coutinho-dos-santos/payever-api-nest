import { Test } from "@nestjs/testing"
import * as request from "supertest";
import { Connection } from "mongoose"
import { AppModule } from "../../../app.module"
import { DatabaseService } from "../../../database/database.service";
import { userStub } from "../stubs/user.stub";
import { compareSync } from 'bcrypt'

describe('UsersController' , () => {

    let dbConnection: Connection;
    let httpServer: any;
    let app:any

    beforeAll( async () => {
        const moduleRef = await Test.createTestingModule({
            imports:[AppModule]
        }).compile()

        app = moduleRef.createNestApplication();
        await app.init();

        dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
        httpServer = app.getHttpServer();
    })

    afterAll (async() =>{
        await app.close();
    })

    beforeEach((async()=>{await dbConnection.collection('users').deleteMany({})}))

    describe('getUsers', () => {
        it('shold return a users array', async () => {
            await dbConnection.collection('users').insertOne(userStub())
            const response = await request(httpServer).get('/api/users')
            expect(response.status).toBe(200)
            expect(response.body).toMatchObject([userStub()]);
        })
    })

    describe('createUser', () => {
        it('shold return the user created', async () => {
            const response = await request(httpServer).post('/api/users').send({
                email: userStub().email,
                password: userStub().password,
                favoriteBrands: userStub().favoriteBrands
            })

            const responseUser = response.body;
            expect(response.status).toBe(201)
            expect(responseUser.email).toEqual(userStub().email)
            expect(responseUser.favoriteBrands).toEqual(userStub().favoriteBrands)
            expect(responseUser).toHaveProperty('_id')
            expect(responseUser).toHaveProperty('userUuid')
        })
    })
})