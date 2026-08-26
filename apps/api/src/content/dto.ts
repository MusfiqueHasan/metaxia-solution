import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateServiceDto {
  @IsString() @IsNotEmpty() slug: string;
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() excerpt: string;
  @IsString() @IsNotEmpty() body: string;
  @IsString() @IsNotEmpty() icon: string;
  @IsInt() order: number;
}
export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

export class CreateCaseStudyDto {
  @IsString() @IsNotEmpty() slug: string;
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() category: string;
  @IsString() @IsNotEmpty() excerpt: string;
  @IsString() @IsNotEmpty() body: string;
  @IsString() @IsNotEmpty() coverGradient: string;
  @IsOptional() @IsString() websiteUrl?: string;
  @IsOptional() @IsString() previewImage?: string;
  @IsInt() order: number;
}
export class UpdateCaseStudyDto extends PartialType(CreateCaseStudyDto) {}

export class CreatePostDto {
  @IsString() @IsNotEmpty() slug: string;
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() category: string;
  @IsString() @IsNotEmpty() excerpt: string;
  @IsString() @IsNotEmpty() body: string;
  @IsOptional() @IsISO8601() publishedAt?: string;
}
export class UpdatePostDto extends PartialType(CreatePostDto) {}

export class CreateTeamMemberDto {
  @IsString() @IsNotEmpty() slug: string;
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() role: string;
  @IsString() @IsNotEmpty() bio: string;
  @IsOptional() @IsString() linkedinUrl?: string;
  @IsInt() order: number;
}
export class UpdateTeamMemberDto extends PartialType(CreateTeamMemberDto) {}

export class CreateJobDto {
  @IsString() @IsNotEmpty() slug: string;
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() location: string;
  @IsString() @IsNotEmpty() type: string;
  @IsString() @IsNotEmpty() body: string;
}
export class UpdateJobDto extends PartialType(CreateJobDto) {}

export class CreatePricingPlanDto {
  @IsString() @IsNotEmpty() name: string;
  @IsInt() price: number;
  @IsString() @IsNotEmpty() period: string;
  @IsString() @IsNotEmpty() description: string;
  @IsArray() @IsString({ each: true }) features: string[];
  @IsBoolean() highlighted: boolean;
  @IsInt() order: number;
}
export class UpdatePricingPlanDto extends PartialType(CreatePricingPlanDto) {}

export class CreateFaqItemDto {
  @IsString() @IsNotEmpty() question: string;
  @IsString() @IsNotEmpty() answer: string;
  @IsInt() order: number;
}
export class UpdateFaqItemDto extends PartialType(CreateFaqItemDto) {}

export class CreateTestimonialDto {
  @IsString() @IsNotEmpty() quote: string;
  @IsString() @IsNotEmpty() author: string;
  @IsString() @IsNotEmpty() company: string;
  @IsInt() order: number;
}
export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {}
