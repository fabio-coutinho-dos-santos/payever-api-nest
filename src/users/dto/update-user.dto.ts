import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @ApiPropertyOptional({ default: 'email user' })
  email: string;

  @IsNotEmpty()
  // @Matches(Regex expression, {message:'A senha deve conter ...'})
  @ApiPropertyOptional({ default: 'password user' })
  password: string;

  @IsNotEmpty()
  @ApiPropertyOptional()
  favoriteBrands: string[];
}
