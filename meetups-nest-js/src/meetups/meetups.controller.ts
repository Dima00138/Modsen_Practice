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
import { MeetupService } from './meetups.service';
import { MeetupDto } from './dto/meetup.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('meetups')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Get()
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
  findOne(@Param('id') id: number) {
    return this.meetupService.getMeetupById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() meetupData: MeetupDto) {
    return this.meetupService.createMeetup(meetupData);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard)
  update(@Param('id') id: number, @Body() meetupData: MeetupDto) {
    return this.meetupService.updateMeetup(id, meetupData);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: number) {
    return this.meetupService.deleteMeetup(id);
  }
}