import { Injectable } from '@nestjs/common';
import { UserMeetup } from '@prisma/client';
import { PrismaService } from 'src/database/database.service';

@Injectable()
export class SubscribeService {
    constructor(private readonly prismaService: PrismaService) {}

    async createUserMeetup(meetupId: number, userId: number): Promise<UserMeetup> {
        return this.prismaService.userMeetup.create({
            data: {
                userId: userId,
                meetupId: meetupId
            },
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
