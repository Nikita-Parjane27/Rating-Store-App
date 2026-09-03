import { IsEmail, IsNotEmpty, IsString, Length, Matches, MaxLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @Length(20, 60)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 16)
  @Matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/, {
    message: 'Password must contain at least one uppercase letter and one special character',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  address: string;
}