import { Module } from '@nestjs/common';
import { MeetupsController } from './meetups.controller';
import { MeetupsService } from './meetups.service';

@Module({
  imports: [],
  controllers: [MeetupsController],
  providers: [MeetupsService],
})
export class MeetupModule {}