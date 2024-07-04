import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MeetupsService } from './meetups.service';
import { MeetupDto } from './meetup.dto';

@Controller('meetups')
export class MeetupController {
  constructor(private readonly meetupService: MeetupsService) {}

  @Get()
  @UseGuards(AuthGuard())
  findAll(
    @Query('search') search: string,
    @Query('tags') tags: string,
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('sortByTitle') sortByTitle: string,
    @Query('sortByDescription') sortByDescription: string,
    @Query('sortByTime') sortByTime: string,
    @Query('sortByLocation') sortByLocation: string,
  ) {
    return this.meetupService.findAll(search, tags, size, page, sortByTitle, sortByDescription, sortByTime, sortByLocation);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param('id') id: number) {
    return this.meetupService.getMeetupById(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() meetupData: MeetupDto) {
    return this.meetupService.createMeetup(meetupData);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  update(@Param('id') id: number, @Body() meetupData: MeetupDto) {
    return this.meetupService.updateMeetup(id, meetupData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: number) {
    return this.meetupService.deleteMeetup(id);
  }
}