import { Injectable } from '@nestjs/common';
import { UserMeetup } from '@prisma/client';
import { PrismaService } from 'src/database/database.service';
import userMeetupScheme from './userMeetup.dto';

@Injectable()
export class SubscribeService {
    constructor(private readonly prismaService: PrismaService) {}

    async createUserMeetup(data: Partial<UserMeetup>): Promise<UserMeetup> {
        const validData = userMeetupScheme.validate(data);
        return this.prismaService.userMeetup.create({
            data: validData,
        });
    }

    async deleteUserMeetup(userId: number, meetupId: number): Promise<UserMeetup> {
        return this.prismaService.userMeetup.delete({
            where: {
                userId_meetupId: {
                    userId: userId, 
                    meetupId: meetupId
                }
            }
        })
    }
}
