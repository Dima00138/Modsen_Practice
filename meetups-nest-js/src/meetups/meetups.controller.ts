import { Post, Put, Delete, Body, Controller, Get, Param, Query } from '@nestjs/common';
import { MeetupsService } from './meetups.service';

@Controller("meetups")
export class MeetupsController {
  constructor(private readonly meetupsService: MeetupsService) {}

  @Get()
  async getMeetups(@Query() query): Promise<any> {
    
    return [];
  }

  @Get(':id')
  async getMeetupById(@Param('id') id: string): Promise<any> {
    
    return {};
  }

  @Post()
  async createMeetup(@Body() body: any): Promise<any> {
    
    return {};
  }
  @Put(':id')
  async updateMeetup(@Param('id') id: string, @Body() body: any): Promise<any> {
    
    return {};
  }

  @Delete(':id')
  async deleteMeetup(@Param('id') id: string): Promise<any> {
    
    return {};
  }
}