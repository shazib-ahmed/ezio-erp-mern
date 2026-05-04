import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Business name is required' })
  businessName: string;

  @IsEmail({}, { message: 'Invalid company email' })
  @IsNotEmpty({ message: 'Company email is required' })
  companyEmail: string;

  @IsString()
  @IsNotEmpty({ message: 'Industry is required' })
  industryId: string;

  @IsString()
  @IsNotEmpty({ message: 'Admin name is required' })
  adminName: string;

  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsEmail({}, { message: 'Invalid admin email' })
  @IsNotEmpty({ message: 'Admin email is required' })
  adminEmail: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
