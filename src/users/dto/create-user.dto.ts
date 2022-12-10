import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsNotEmpty } from 'class-validator'


export class CreateUserDto 
{
    @IsNotEmpty()
    @ApiProperty({default:'name user'})
    name: string;

    @IsNotEmpty()
    @ApiPropertyOptional({default:'password user'})
    password: string;
}