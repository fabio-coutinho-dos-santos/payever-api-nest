import { User } from "src/users/schema/user.schema";

export const userStub = () : User => {
    return{
        id:1
        , email: 'fake@gmail.com'
        , first_name: 'duadfjaksfjeijfjça'
        , last_name: 'duadfjaksfjeijfjça'
        , avatar: 'avatar'    
    }
}