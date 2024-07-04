import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { SubscribeService } from './subscribe.service';
import { Request } from 'express';

@Controller()
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async subscribe(@Param('id') meetupId: number, @Req() req: Request) {
    return this.subscribeService.createUserMeetup(meetupId, parseInt(req.user['sub']));
  }

}
