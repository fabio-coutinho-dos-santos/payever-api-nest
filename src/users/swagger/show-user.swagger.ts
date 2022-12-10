import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";

export class ShowUserSwagger
{
    @ApiProperty()
    _id:string

    @ApiProperty()
    email:string

    @ApiPropertyOptional()
    password:string

    @ApiPropertyOptional()
    createdAt:string

    @ApiPropertyOptional()
    updatedAt:string
}