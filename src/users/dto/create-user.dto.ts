import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsNotEmpty, Matches } from 'class-validator'


export class CreateUserDto 
{
    @IsNotEmpty()
    @ApiProperty({default:'email user'})
    email: string;

    @IsNotEmpty()
    // @Matches(Regex expression, {message:'A senha deve conter ...'})
    @ApiProperty({default:'password user'})
    password: string;
}