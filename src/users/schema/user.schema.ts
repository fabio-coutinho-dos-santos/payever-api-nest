import { InjectModel, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type UserDocument = User & Document
@Schema()
export class User
{
    @Prop({unique:true})
    id?: number;

    @Prop({unique:true})
    email: string;

    @Prop()
    avatar: string;

    @Prop()
    first_name: string

    @Prop()
    last_name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.virtual('autoIncrement').get(function () {
//     return this.id;
// });

UserSchema.plugin(mongoosePaginate);
