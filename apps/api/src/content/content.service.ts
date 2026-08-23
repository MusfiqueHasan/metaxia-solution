import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toPricingPlan, toPost, toJob } from './serialize';

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
}
