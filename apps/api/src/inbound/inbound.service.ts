import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContactDto, NewsletterDto } from './dto';

@Injectable()
export class InboundService {
  constructor(private db: PrismaService) {}

  async contact(dto: ContactDto) {
    await this.db.contactSubmission.create({ data: dto });
    return { ok: true };
  }

  async newsletter(dto: NewsletterDto) {
    await this.db.newsletterSubscriber.upsert({
      where: { email: dto.email },
      update: {},
      create: { email: dto.email },
    });
    return { ok: true };
  }
}
