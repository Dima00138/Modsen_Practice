import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { SubscribeService } from './subscribe.service';
import { Request } from 'express';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('subscribe')
@Controller("subscribe")
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Subscribe to a meetup' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the meetup to subscribe to' })
  @ApiResponse({ status: 200, description: 'Successfully subscribed to the meetup.' })
  @UseGuards(AccessTokenGuard)
  async subscribe(@Param('id') meetupId: string, @Req() req: Request) {
    return this.subscribeService.createUserMeetup(parseInt(meetupId), parseInt(req.user['sub']));
  }

}
