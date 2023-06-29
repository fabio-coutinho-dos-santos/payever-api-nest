import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { CreateUserDto } from "../dto/create-user.dto";

export class ShowUserSwagger extends CreateUserDto
{
}