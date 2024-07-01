import { UserMeetup, PrismaClient } from "@prisma/client";
import userMeetupScheme from "../dto/userMeetup.dto";

export interface IUserMeetupRepository {
    createUserMeetup(data: Partial<UserMeetup>) : Promise<UserMeetup>;
    deleteUserMeetup(userId: number, meetupId: number) : Promise<UserMeetup>;
}

export class UserMeetupRepository implements IUserMeetupRepository {
    private prisma : PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }


    createUserMeetup(data: Partial<UserMeetup>): Promise<UserMeetup> {
        const validData = userMeetupScheme.validate(data);
        return this.prisma.userMeetup.create({
            data: validData,
        });
    }

    deleteUserMeetup(userId: number, meetupId: number): Promise<UserMeetup> {
        return this.prisma.userMeetup.delete({
            where: {
                userId_meetupId: {
                    userId: userId, 
                    meetupId: meetupId
                }
            }
        })
    }
}

export default UserMeetupRepository;