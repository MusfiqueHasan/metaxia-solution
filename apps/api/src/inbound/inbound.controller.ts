import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { InboundService } from './inbound.service';
import { ContactDto, NewsletterDto } from './dto';

@Controller()
export class InboundController {
  constructor(private inbound: InboundService) {}

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('contact')
  contact(@Body() dto: ContactDto) { return this.inbound.contact(dto); }

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('newsletter')
  newsletter(@Body() dto: NewsletterDto) { return this.inbound.newsletter(dto); }
}
