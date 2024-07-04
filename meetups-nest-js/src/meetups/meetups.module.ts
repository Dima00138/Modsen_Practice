import { Module } from '@nestjs/common';
import { MeetupController } from './meetups.controller';
import { MeetupService } from './meetups.service';

@Module({
  imports: [],
  controllers: [MeetupController],
  providers: [MeetupService],
})
export class MeetupModule {}