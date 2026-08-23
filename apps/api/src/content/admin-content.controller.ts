import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { ContentService } from './content.service';
import {
  CreateServiceDto, UpdateServiceDto,
  CreateCaseStudyDto, UpdateCaseStudyDto,
  CreatePostDto, UpdatePostDto,
  CreateTeamMemberDto, UpdateTeamMemberDto,
  CreateJobDto, UpdateJobDto,
  CreatePricingPlanDto, UpdatePricingPlanDto,
  CreateFaqItemDto, UpdateFaqItemDto,
  CreateTestimonialDto, UpdateTestimonialDto,
} from './dto';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminContentController {
  constructor(private content: ContentService) {}

  @Post('services') createService(@Body() d: CreateServiceDto) { return this.content.createService(d); }
  @Patch('services/:id') updateService(@Param('id') id: string, @Body() d: UpdateServiceDto) { return this.content.updateService(id, d); }
  @Delete('services/:id') deleteService(@Param('id') id: string) { return this.content.deleteService(id); }

  @Post('case-studies') createCaseStudy(@Body() d: CreateCaseStudyDto) { return this.content.createCaseStudy(d); }
  @Patch('case-studies/:id') updateCaseStudy(@Param('id') id: string, @Body() d: UpdateCaseStudyDto) { return this.content.updateCaseStudy(id, d); }
  @Delete('case-studies/:id') deleteCaseStudy(@Param('id') id: string) { return this.content.deleteCaseStudy(id); }

  @Post('posts') createPost(@Body() d: CreatePostDto) { return this.content.createPost(d); }
  @Patch('posts/:id') updatePost(@Param('id') id: string, @Body() d: UpdatePostDto) { return this.content.updatePost(id, d); }
  @Delete('posts/:id') deletePost(@Param('id') id: string) { return this.content.deletePost(id); }

  @Post('team') createTeamMember(@Body() d: CreateTeamMemberDto) { return this.content.createTeamMember(d); }
  @Patch('team/:id') updateTeamMember(@Param('id') id: string, @Body() d: UpdateTeamMemberDto) { return this.content.updateTeamMember(id, d); }
  @Delete('team/:id') deleteTeamMember(@Param('id') id: string) { return this.content.deleteTeamMember(id); }

  @Post('jobs') createJob(@Body() d: CreateJobDto) { return this.content.createJob(d); }
  @Patch('jobs/:id') updateJob(@Param('id') id: string, @Body() d: UpdateJobDto) { return this.content.updateJob(id, d); }
  @Delete('jobs/:id') deleteJob(@Param('id') id: string) { return this.content.deleteJob(id); }

  @Post('pricing') createPricingPlan(@Body() d: CreatePricingPlanDto) { return this.content.createPricingPlan(d); }
  @Patch('pricing/:id') updatePricingPlan(@Param('id') id: string, @Body() d: UpdatePricingPlanDto) { return this.content.updatePricingPlan(id, d); }
  @Delete('pricing/:id') deletePricingPlan(@Param('id') id: string) { return this.content.deletePricingPlan(id); }

  @Post('faq') createFaqItem(@Body() d: CreateFaqItemDto) { return this.content.createFaqItem(d); }
  @Patch('faq/:id') updateFaqItem(@Param('id') id: string, @Body() d: UpdateFaqItemDto) { return this.content.updateFaqItem(id, d); }
  @Delete('faq/:id') deleteFaqItem(@Param('id') id: string) { return this.content.deleteFaqItem(id); }

  @Post('testimonials') createTestimonial(@Body() d: CreateTestimonialDto) { return this.content.createTestimonial(d); }
  @Patch('testimonials/:id') updateTestimonial(@Param('id') id: string, @Body() d: UpdateTestimonialDto) { return this.content.updateTestimonial(id, d); }
  @Delete('testimonials/:id') deleteTestimonial(@Param('id') id: string) { return this.content.deleteTestimonial(id); }
}
