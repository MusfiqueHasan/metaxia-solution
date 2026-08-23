import { Controller, Get, Param } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller()
export class ContentController {
  constructor(private content: ContentService) {}

  @Get('services') services() { return this.content.listServices(); }
  @Get('services/:slug') service(@Param('slug') slug: string) { return this.content.getService(slug); }

  @Get('case-studies') caseStudies() { return this.content.listCaseStudies(); }
  @Get('case-studies/:slug') caseStudy(@Param('slug') slug: string) { return this.content.getCaseStudy(slug); }

  @Get('posts') posts() { return this.content.listPosts(); }
  @Get('posts/:slug') post(@Param('slug') slug: string) { return this.content.getPost(slug); }

  @Get('team') team() { return this.content.listTeam(); }
  @Get('team/:slug') teamMember(@Param('slug') slug: string) { return this.content.getTeamMember(slug); }

  @Get('jobs') jobs() { return this.content.listJobs(); }
  @Get('jobs/:slug') job(@Param('slug') slug: string) { return this.content.getJob(slug); }

  @Get('pricing') pricing() { return this.content.listPricing(); }
  @Get('faq') faq() { return this.content.listFaq(); }
  @Get('testimonials') testimonials() { return this.content.listTestimonials(); }
}
