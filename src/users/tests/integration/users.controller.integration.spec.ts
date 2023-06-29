import { Test } from "@nestjs/testing"
import * as request from "supertest";
import { Connection } from "mongoose"
import { AppModule } from "../../../app.module"
import { DatabaseService } from "../../../database/database.service";
import { userStub } from "../stubs/user.stub";

describe('UsersController' , () => {
    
    let dbConnection: Connection;
    let httpServer: any;
    let app:any
    const newUser = {
        id: userStub().id,
        email : userStub().email,
        first_name : userStub().first_name,
        last_name : userStub().last_name,
    }


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

    beforeEach((async()=>
    {
        if(process.env.NODE_ENV === 'test'){await dbConnection.collection('users').deleteMany({})}
    }))

    describe('createUser', () => {
        it('shold return the user created', async () => {
            const response = await request(httpServer).post('/api/users').field({
                email: userStub().email,
                last_name: userStub().last_name,
                first_name: userStub().first_name,

            }).attach('image', 'public/images/logo-nest.png');

            const responseUser = response.body;
            expect(response.status).toBe(201)
            expect(responseUser.email).toEqual(userStub().email)
            expect(responseUser.last_name).toEqual(userStub().last_name)
            expect(responseUser.first_name).toEqual(userStub().first_name)
            expect(responseUser).toHaveProperty('id')
        })
    })

    describe('createUser without image', () => {
        it('shold return an error 400', async () => {
            const response = await request(httpServer).post('/api/users').field({
                email: userStub().email,
                last_name: userStub().last_name,
                first_name: userStub().first_name,
            });

            const res = response.body;
            expect(response.status).toBe(400)
            expect(res.statusCode).toBe(400)
            expect(res.error).toBe("Bad Request")
        })
    })

    describe('createUser without email', () => {
        it('shold return an error 400', async () => {
            const response = await request(httpServer).post('/api/users').field({
                last_name: userStub().last_name,
                first_name: userStub().first_name,
            }).attach('image', 'public/images/logo-nest.png');

            const res = response.body;
            expect(response.status).toBe(400)
            expect(res.statusCode).toBe(400)
            expect(res.error).toBe("Bad Request")
        })
    })

    describe('createUser without first name', () => {
        it('shold return an error 400', async () => {
            const response = await request(httpServer).post('/api/users').field({
                last_name: userStub().last_name,
                email: userStub().email,
            }).attach('image', 'public/images/logo-nest.png');

            const res = response.body;
            expect(response.status).toBe(400)
            expect(res.statusCode).toBe(400)
            expect(res.error).toBe("Bad Request")
        })
    })

    describe('createUser without last name', () => {
        it('shold return an error 400', async () => {
            const response = await request(httpServer).post('/api/users').field({
                email: userStub().email,
                first_name: userStub().first_name,
            }).attach('image', 'public/images/logo-nest.png');

            const res = response.body;
            expect(response.status).toBe(400)
            expect(res.statusCode).toBe(400)
            expect(res.error).toBe("Bad Request")
        })
    })

    describe('createUser with same email', () => {
        it('shold return an error 500', async () => {
            await dbConnection.collection('users').insertOne(newUser)
            const response = await request(httpServer).post('/api/users').field({
                email: newUser.email,
                first_name: userStub().first_name,
                last_name: userStub().last_name,
            }).attach('image', 'public/images/logo-nest.png');

            const res = response.body;
            expect(response.status).toBe(400)
            expect(res.statusCode).toBe(400)
            expect(res.error).toBe("Bad Request")
        })
    })

    describe('getUserById with valid id', () => {
        it('shold return an user', async () => {
            const response = await request(httpServer).get('/api/users/1');

            const responseUser = response.body;
            expect(response.status).toBe(200)
            expect(responseUser).toHaveProperty('email')
            expect(responseUser).toHaveProperty('last_name')
            expect(responseUser).toHaveProperty('first_name')
            expect(responseUser).toHaveProperty('avatar')
            expect(responseUser.id).toEqual(1);
        })
    })

    describe('getUserById with invalid id', () => {
        it('shold return error 404', async () => {
            const response = await request(httpServer).get('/api/users/-1');
            const res = response.body;
            expect(response.status).toBe(404)
            expect(res.statusCode).toBe(404)
            expect(res.message).toBe('User not found')
            expect(res.error).toBe("Not Found")
        })
    })

    describe('getAvatar with valid id', () => {
        it('shold return an avatar content base64 encoded', async () => {
            const response = await request(httpServer).get('/api/users/1/avatar');
            const responseAvatar = response.body;
            expect(response.status).toBe(200)
            expect(responseAvatar).toHaveProperty('avatarContent')
        })
    })

    describe('getAvatar with invalid id', () => {
        it('shold return error 404', async () => {
            const response = await request(httpServer).get('/api/users/-1/avatar');
            const res = response.body;
            expect(response.status).toBe(404)
            expect(res.statusCode).toBe(404)
            expect(res.message).toBe('User not found')
            expect(res.error).toBe("Not Found")
        })
    })

    describe('delete avatar with valid id', () => {
        it('shold return an delete object', async () => {
            await dbConnection.collection('users').insertOne(newUser)
            const response = await request(httpServer).delete('/api/users/13/avatar');
            const res = response.body;
            expect(response.status).toBe(200)
            expect(res).toHaveProperty('avatarDeleted')
            expect(res).toHaveProperty('userDeleted')
        })
    })

    describe('delete avatar with invalid id', () => {
        it('shold return error 404', async () => {
            const response = await request(httpServer).delete('/api/users/-1/avatar');
            const res = response.body;
            expect(response.status).toBe(404)
            expect(res.statusCode).toBe(404)
            expect(res.message).toBe('User not found')
            expect(res.error).toBe("Not Found")
        })
    })

})