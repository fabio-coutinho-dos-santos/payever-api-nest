import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsEmail, IsIn, IsNotEmpty, Matches } from 'class-validator'


export class CreateUserDto 
{
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({default:'email@email.com'})
    email: string;

    @IsNotEmpty()
    @Matches(new RegExp(/([0-9][0-9][0-9][0-9][0-9])/), {message:'Password should have only numbers and at least size = 5'})
    @ApiProperty({default:'password user'})
    password: string;

    @IsNotEmpty()
    @IsArray()
    @ApiProperty()
    favoriteBrands: string[];
}