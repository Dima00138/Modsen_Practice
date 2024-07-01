import { Meetup, PrismaClient } from "@prisma/client";
import meetupScheme from "../meetups/meetup.dto";

export interface IMeetupRepository {
    createMeetup(data: Partial<Meetup>) : Promise<Meetup>;
    getFilteredMeetups(where: {}, orderBy: {}, take: number, skip: number) : Promise<Meetup[]>;
    getMeetupById(id: number): Promise<Meetup | null>;
    updateMeetup(id: number, updatedData: Partial<Meetup>): Promise<Meetup>;
    deleteMeetup(id: number): Promise<Meetup>;
}

export class MeetupRepository implements IMeetupRepository {
    private prisma : PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }


    createMeetup(data: Partial<Meetup>): Promise<Meetup> {
        const validData = meetupScheme.validate(data);
        return this.prisma.meetup.create({
            data: validData,
        });
    }

    getFilteredMeetups( where: {}, orderBy: {}, take: number, skip: number): Promise<Meetup[]> {
        return this.prisma.meetup.findMany({
            where,
            orderBy,
            take,
            skip,
        });
    }
    
    getMeetupById(id: number): Promise<Meetup | null> {
        return this.prisma.meetup.findUnique({
            where: { id: Number(id) },
        });
    }

    updateMeetup(id: number, updatedData: Partial<Meetup>) : Promise<Meetup> {
        return this.prisma.meetup.update({
            where: { id: id },
            data: updatedData,
        });
    }

    deleteMeetup(id: number): Promise<Meetup> {
        return this.prisma.meetup.delete({
            where: { id: id },
    });
    }

}

export default MeetupRepository;