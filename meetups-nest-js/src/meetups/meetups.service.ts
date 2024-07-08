import { BadRequestException, Injectable } from '@nestjs/common';
import { Meetup } from '@prisma/client';
import meetupScheme from './dto/meetup.dto';
import { PrismaService } from 'src/database/database.service';

@Injectable()
export class MeetupService {
  constructor(private readonly prismaService: PrismaService) {}

  async getFilteredMeetups( where: {}, orderBy: {}, take: number, skip: number): Promise<Meetup[]> {
    return this.prismaService.meetup.findMany({
        where,
        orderBy,
        take,
        skip,
    });
  }

  async findAll(
    search: string,
    tags: string,
    size: number,
    page: number,
    sortByTitle: string,
    sortByDescription: string,
    sortByTime: string,
    sortByLocation: string,
  ) {
    try {
      let whereCondition = {};
      if (search) {
          whereCondition = {
              OR: [
                  { title: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
              ],
          };
      }

      if (tags) {
          whereCondition = { 
              ...whereCondition,
              tags: { hasSome: tags.toString().split(',') }
          }
      }

      let orderBy = {};
      if (sortByTitle) {
          orderBy = { title: sortByTitle };
      } else if (sortByDescription) {
          orderBy = { description: sortByDescription };
      } else if (sortByTime) {
          orderBy = { time: sortByTime };
      } else if (sortByLocation) {
          orderBy = { location: sortByLocation };
      }

      const skip = (parseInt(page?.toString()?? "1") - 1) * parseInt(size?.toString()?? "5");
      const take = parseInt(size?.toString()?? "5");

      const result = await this.getFilteredMeetups(whereCondition, orderBy, take, skip);
      return result;
  }
  catch(e) {
    throw new BadRequestException(e.message);
  }
}


  async createMeetup(data: Partial<Meetup>, userId: number): Promise<Meetup> {
    const validData = meetupScheme.validate(data);
    return this.prismaService.meetup.create({
        data: {
          ...validData.value,
          userId: userId
        },
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
