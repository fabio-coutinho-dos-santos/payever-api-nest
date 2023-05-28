import { User } from "src/users/schema/user.schema";

export const userStub = () : User => {
    return{
        userUuid:'348f73fb-dc75-4a78-94b2-7020664e4c7a'
        , email: 'fake@gmail.com'
        , password: 'duadfjaksfjeijfjça'
        , favoriteBrands: ['Coca-cola', 'Nike']
    }
}