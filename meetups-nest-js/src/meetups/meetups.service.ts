import { Injectable } from '@nestjs/common';
import { Meetup } from '@prisma/client';
import meetupScheme from './meetup.dto';
import { PrismaService } from 'src/database/database.service';

@Injectable()
export class MeetupsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getFilteredMeetups( where: {}, orderBy: {}, take: number, skip: number): Promise<Meetup[]> {
    return this.prismaService.meetup.findMany({
        where,
        orderBy,
        take,
        skip,
    });
  }

  async createMeetup(data: Partial<Meetup>): Promise<Meetup> {
    const validData = meetupScheme.validate(data);
    return this.prismaService.meetup.create({
        data: validData,
    });
  }

  async updateMeetup(id: number, updatedData: Partial<Meetup>) : Promise<Meetup> {
    return this.prismaService.meetup.update({
        where: { id: id },
        data: updatedData,
    });
  }

  async deleteMeetup(id: number): Promise<Meetup> {
    return this.prismaService.meetup.delete({
        where: { id: id },
    });
  }

  async getMeetupById(id: number): Promise<Meetup | null> {
    return this.prismaService.meetup.findUnique({
        where: { id: Number(id) },
    });
  }
}
