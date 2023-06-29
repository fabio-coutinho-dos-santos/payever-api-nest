import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class DeleteUserSwagger
{
    @IsNotEmpty()
    @ApiProperty({default:true})
    userDeleted: boolean;

    @IsNotEmpty()
    @ApiProperty({default:true})
    avatarDeleted: boolean;
}