import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminInboundController {
  constructor(private db: PrismaService) {}

  @Get('contact-submissions')
  contactSubmissions() { return this.db.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } }); }

  @Get('newsletter-subscribers')
  newsletterSubscribers() { return this.db.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } }); }
}
