import { ApiProperty } from "@nestjs/swagger";

export class NotFundSwagger 
{
    @ApiProperty()
    statusCode:number

    @ApiProperty()
    message:string

    @ApiProperty()
    error:string
}