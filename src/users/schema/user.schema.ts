// import * as mongoose from  'mongoose';

// export const UserSchema = new mongoose.Schema({
//     email: String,
//     password: String,
// },{
//     timestamps: true
// })

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document

@Schema({timestamps: true})
export class User
{
    @Prop()
    userUuid?: string;

    @Prop()
    email: string;

    @Prop()
    password: string

    @Prop([String])
    favoriteBrands: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
