import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ContactDto {
  @IsString() @IsNotEmpty() @MaxLength(120) name: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() @MaxLength(40) phone?: string;
  @IsString() @IsNotEmpty() @MaxLength(5000) message: string;
}

export class NewsletterDto {
  @IsEmail() email: string;
}
