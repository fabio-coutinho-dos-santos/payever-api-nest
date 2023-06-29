import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'


export class CreateUserDto 
{
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({default:'teste@gmail.com'})
    email: string;

    @IsNotEmpty()
    @ApiProperty({default:'Fabio'})
    first_name: string;

    @IsNotEmpty()
    @ApiProperty({default:'Santos'})
    last_name: string;

    @IsNotEmpty()
    @ApiProperty({default:"https://reqres.in/img/faces/1-image.jpg"})
    avatar: string;
}