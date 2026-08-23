import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { InboundController } from './inbound.controller';
import { AdminInboundController } from './admin-inbound.controller';
import { InboundService } from './inbound.service';

@Module({
  imports: [AuthModule],
  controllers: [InboundController, AdminInboundController],
  providers: [InboundService],
})
export class InboundModule {}
