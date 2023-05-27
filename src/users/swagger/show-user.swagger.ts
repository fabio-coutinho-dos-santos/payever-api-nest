import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";

export class ShowUserSwagger
{
    @ApiProperty()
    userUuid:string

    @ApiProperty()
    email:string

    @ApiPropertyOptional()
    password:string

    @ApiPropertyOptional()
    favoriteBrands:string[]

    @ApiPropertyOptional()
    createdAt:string

    @ApiPropertyOptional()
    updatedAt:string
}