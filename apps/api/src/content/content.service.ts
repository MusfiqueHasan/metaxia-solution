import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toPricingPlan, toPost, toJob } from './serialize';
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

@Injectable()
export class ContentService {
  constructor(private db: PrismaService) {}

  listServices() { return this.db.service.findMany({ orderBy: { order: 'asc' } }); }
  async getService(slug: string) {
    const s = await this.db.service.findUnique({ where: { slug } });
    if (!s) throw new NotFoundException('service not found');
    return s;
  }

  listCaseStudies() { return this.db.caseStudy.findMany({ orderBy: { order: 'asc' } }); }
  async getCaseStudy(slug: string) {
    const c = await this.db.caseStudy.findUnique({ where: { slug } });
    if (!c) throw new NotFoundException('case study not found');
    return c;
  }

  async listPosts() {
    return (await this.db.post.findMany({ orderBy: { publishedAt: 'desc' } })).map(toPost);
  }
  async getPost(slug: string) {
    const p = await this.db.post.findUnique({ where: { slug } });
    if (!p) throw new NotFoundException('post not found');
    return toPost(p);
  }

  listTeam() { return this.db.teamMember.findMany({ orderBy: { order: 'asc' } }); }
  async getTeamMember(slug: string) {
    const t = await this.db.teamMember.findUnique({ where: { slug } });
    if (!t) throw new NotFoundException('team member not found');
    return t;
  }

  async listJobs() {
    return (await this.db.job.findMany({ orderBy: { createdAt: 'desc' } })).map(toJob);
  }
  async getJob(slug: string) {
    const j = await this.db.job.findUnique({ where: { slug } });
    if (!j) throw new NotFoundException('job not found');
    return toJob(j);
  }

  async listPricing() {
    return (await this.db.pricingPlan.findMany({ orderBy: { order: 'asc' } })).map(toPricingPlan);
  }
  listFaq() { return this.db.faqItem.findMany({ orderBy: { order: 'asc' } }); }
  listTestimonials() { return this.db.testimonial.findMany({ orderBy: { order: 'asc' } }); }

  // ---- mutations ----

  // services
  createService(data: CreateServiceDto) { return this.db.service.create({ data }); }
  async updateService(id: string, data: UpdateServiceDto) {
    await this.mustExist(this.db.service, id);
    return this.db.service.update({ where: { id }, data });
  }
  async deleteService(id: string) {
    await this.mustExist(this.db.service, id);
    return this.db.service.delete({ where: { id } });
  }

  // case studies
  createCaseStudy(data: CreateCaseStudyDto) { return this.db.caseStudy.create({ data }); }
  async updateCaseStudy(id: string, data: UpdateCaseStudyDto) {
    await this.mustExist(this.db.caseStudy, id);
    return this.db.caseStudy.update({ where: { id }, data });
  }
  async deleteCaseStudy(id: string) {
    await this.mustExist(this.db.caseStudy, id);
    return this.db.caseStudy.delete({ where: { id } });
  }

  // posts
  async createPost({ publishedAt, ...rest }: CreatePostDto) {
    const post = await this.db.post.create({
      data: { ...rest, ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}) },
    });
    return toPost(post);
  }
  async updatePost(id: string, { publishedAt, ...rest }: UpdatePostDto) {
    await this.mustExist(this.db.post, id);
    const post = await this.db.post.update({
      where: { id },
      data: { ...rest, ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}) },
    });
    return toPost(post);
  }
  async deletePost(id: string) {
    await this.mustExist(this.db.post, id);
    const post = await this.db.post.delete({ where: { id } });
    return toPost(post);
  }

  // team
  createTeamMember(data: CreateTeamMemberDto) { return this.db.teamMember.create({ data }); }
  async updateTeamMember(id: string, data: UpdateTeamMemberDto) {
    await this.mustExist(this.db.teamMember, id);
    return this.db.teamMember.update({ where: { id }, data });
  }
  async deleteTeamMember(id: string) {
    await this.mustExist(this.db.teamMember, id);
    return this.db.teamMember.delete({ where: { id } });
  }

  // jobs
  async createJob(data: CreateJobDto) {
    return toJob(await this.db.job.create({ data }));
  }
  async updateJob(id: string, data: UpdateJobDto) {
    await this.mustExist(this.db.job, id);
    return toJob(await this.db.job.update({ where: { id }, data }));
  }
  async deleteJob(id: string) {
    await this.mustExist(this.db.job, id);
    return toJob(await this.db.job.delete({ where: { id } }));
  }

  // pricing (JSON boundary)
  async createPricingPlan({ features, ...rest }: CreatePricingPlanDto) {
    return toPricingPlan(await this.db.pricingPlan.create({ data: { ...rest, featuresJson: JSON.stringify(features) } }));
  }
  async updatePricingPlan(id: string, { features, ...rest }: UpdatePricingPlanDto) {
    await this.mustExist(this.db.pricingPlan, id);
    return toPricingPlan(await this.db.pricingPlan.update({
      where: { id },
      data: { ...rest, ...(features ? { featuresJson: JSON.stringify(features) } : {}) },
    }));
  }
  async deletePricingPlan(id: string) {
    await this.mustExist(this.db.pricingPlan, id);
    return toPricingPlan(await this.db.pricingPlan.delete({ where: { id } }));
  }

  // faq
  createFaqItem(data: CreateFaqItemDto) { return this.db.faqItem.create({ data }); }
  async updateFaqItem(id: string, data: UpdateFaqItemDto) {
    await this.mustExist(this.db.faqItem, id);
    return this.db.faqItem.update({ where: { id }, data });
  }
  async deleteFaqItem(id: string) {
    await this.mustExist(this.db.faqItem, id);
    return this.db.faqItem.delete({ where: { id } });
  }

  // testimonials
  createTestimonial(data: CreateTestimonialDto) { return this.db.testimonial.create({ data }); }
  async updateTestimonial(id: string, data: UpdateTestimonialDto) {
    await this.mustExist(this.db.testimonial, id);
    return this.db.testimonial.update({ where: { id }, data });
  }
  async deleteTestimonial(id: string) {
    await this.mustExist(this.db.testimonial, id);
    return this.db.testimonial.delete({ where: { id } });
  }

  private async mustExist(delegate: { findUnique(args: { where: { id: string } }): Promise<unknown> }, id: string) {
    if (!(await delegate.findUnique({ where: { id } }))) throw new NotFoundException();
  }
}
