import { User } from "src/users/schema/user.schema";

export const userStub = () : User => {
    return{
        id:13
        , email: 'fake@gmail.com'
        , first_name: 'firstName'
        , last_name: 'lastName'
        , avatar: 'avatar'    
    }
}