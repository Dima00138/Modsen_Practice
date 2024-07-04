import { Module } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';

@Module({
  providers: [SubscribeService],
  controllers: [SubscribeController]
})
export class SubscribeModule {}
