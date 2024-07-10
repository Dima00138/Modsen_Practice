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
  Req,
} from '@nestjs/common';
import { MeetupService } from './meetups.service';
import { MeetupDto, WorkMeetupDto } from './dto/meetup.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Request } from 'express';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('meetups')
@Controller('meetups')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Get()
  @ApiOperation({ summary: 'Find all meetups' })
  @ApiResponse({ status: 200, description: 'The found meetups.', type: [MeetupDto] })
  @ApiQuery({ name: 'search', required: false, description: 'Search term to filter meetups by title or description.' })
  @ApiQuery({ name: 'tags', required: false, description: 'Comma-separated list of tags to filter meetups by.' })
  @ApiQuery({ name: 'size', required: false, description: 'Number of items per page for pagination.' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination.' })
  @ApiQuery({ name: 'sortByTitle', required: false, description: 'Sort meetups by title.' })
  @ApiQuery({ name: 'sortByDescription', required: false, description: 'Sort meetups by description.' })
  @ApiQuery({ name: 'sortByTime', required: false, description: 'Sort meetups by time.' })
  @ApiQuery({ name: 'sortByLocation', required: false, description: 'Sort meetups by location.' })
  @ApiResponse({ status: 404, description: 'No meetups found.' })
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
  @ApiOperation({ summary: 'Find one meetup by ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the meetup' })
  @ApiResponse({ status: 200, description: 'The found meetup.', type: MeetupDto })
  @ApiResponse({ status: 404, description: 'Meetup not found.' })
  findOne(@Param('id') id: number) {
    return this.meetupService.getMeetupById(id);
  }

  @Post()
  @Roles(["admin"])
  @UseGuards(AccessTokenGuard)
  @ApiSecurity("access-token")
  @ApiOperation({ summary: 'Create a new meetup' })
  @ApiBody({ type: WorkMeetupDto })
  @ApiResponse({ status: 201, description: 'The meetup has been successfully created.', type: MeetupDto })
  create(@Body() meetupData: MeetupDto, @Req() req: Request) {
    return this.meetupService.createMeetup(meetupData, req.user['sub']);
  }

  @Put(':id')
  @Roles(["admin"])
  @UseGuards(AccessTokenGuard)
  @ApiSecurity("access-token")
  @ApiOperation({ summary: 'Update a meetup' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the meetup to update' })
  @ApiBody({ type: WorkMeetupDto })
  @ApiResponse({ status: 200, description: 'The meetup has been successfully updated.', type: MeetupDto })
  update(@Param('id') id: number, @Body() meetupData: WorkMeetupDto) {
    return this.meetupService.updateMeetup(id, meetupData);
  }

  @Delete(':id')
  @Roles(["admin"])
  @UseGuards(AccessTokenGuard)
  @ApiSecurity("access-token")
  @ApiOperation({ summary: 'Delete a meetup' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the meetup to delete' })
  @ApiResponse({ status: 204, description: 'The meetup has been successfully deleted.' })
  remove(@Param('id') id: number) {
    return this.meetupService.deleteMeetup(id);
  }
}