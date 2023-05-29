import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type UserDocument = User & Document
@Schema({timestamps: true})
export class User
{
    @Prop({unique:true})
    userUuid?: string;

    @Prop({unique:true})
    email: string;

    @Prop()
    password: string

    @Prop([String])
    favoriteBrands: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate);
