import { Document, Model, FilterQuery } from 'mongoose'
import { User } from 'src/users/schema/user.schema';
import { hashSync } from 'bcrypt'

export abstract class EntityRepository <T extends Document>{
    constructor(protected readonly entityModel: Model<T>){}

    async create(createEntityData: unknown): Promise<T> {
        const newEntity = new this.entityModel(createEntityData);
        return newEntity.save();
    }

    async update(entityFilterQuery: FilterQuery<T>, updateEntityData: any): Promise <T> {
        if(updateEntityData.password){
            let hashPassword = hashSync(updateEntityData.password,10)
            updateEntityData.password = hashPassword;
        }
        return await this.entityModel.findByIdAndUpdate(entityFilterQuery,updateEntityData,{new:true});
    }
    
    async findOne(entityFilterQuery: FilterQuery<T> | null) : Promise<User>
    {
        return await this.entityModel.findOne(entityFilterQuery);
    }

    async find() : Promise<T[] | null> {
        return await this.entityModel.find()
    }

    async deleteMany(entityFilterQuery: FilterQuery<T>) : Promise<boolean> {
        const deleteResults = await this.entityModel.deleteMany(entityFilterQuery)
        return deleteResults.deletedCount >=1 ? true : false 
    }
}   