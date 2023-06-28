import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Matches } from 'class-validator'


export class AuthLoginDto 
{
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({default:'teste@gmail.com'})
    email: string;

    @IsNotEmpty()
    // @Matches(new RegExp(/([0-9][0-9][0-9][0-9][0-9])/), {message:'Password should have only numbers and at least size = 5'})
    @ApiProperty({default:'passwordTest'})
    password: string;
}