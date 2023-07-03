import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongooseSequence from 'mongoose-sequence';
import * as mongoose from 'mongoose';

const AutoIncrement = mongooseSequence(mongoose);


export type UserDocument = User & Document
export type UserModel = mongoose.Model<User>;

@Schema()
export class User
{
    @Prop({unique: true})
    id: number;

    @Prop({required: true})
    email: string;

    @Prop({required: true})
    first_name: string

    @Prop({required: true})
    last_name: string;

    @Prop()
    avatar: string;    
}

export const UserSchema = SchemaFactory.createForClass(User);


