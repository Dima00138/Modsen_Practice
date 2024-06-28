import { Request, Response } from "express";
import MeetupRepository from "../repositories/meetupRepository";

const repository = new MeetupRepository();

export const getMeetups = async (req: Request, res: Response) => {
    try {
        const { search, tags, size, page } = req.query;
        const {sortByTitle, sortByDescription, sortByTime, sortByLocation} = req.query;

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

        const result = await repository.getFilteredMeetups(whereCondition, orderBy, take, skip);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching meetups" });
    }
};

export const getMeetupById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const meetup = await repository.getMeetupById(parseInt(id));

        if (!meetup) 
            return res.status(404).json({ error: "Meetup not found" });

        res.json(meetup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching meetup" });
    }
};

export const createMeetup = async (req: Request, res: Response) => {    
    try {  
        const newMeetup = await repository.createMeetup({
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags,
            time: req.body.time,
            location: req.body.location,
            userId: parseInt(req.user?.toString() || "0")
            });
        res.status(201).json(newMeetup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create meetup" });
    }
};

export const updateMeetup = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedMeetup = await repository.updateMeetup(parseInt(id), {
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags,
            time: req.body.time,
            location: req.body.location,
        });
        res.json(updatedMeetup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating meetup" });
    }
};

export const deleteMeetup = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedMeetup = await repository.deleteMeetup(parseInt(id));   
        res.json(deletedMeetup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting meetup" });
    }
};

export default {getMeetups, getMeetupById, createMeetup, updateMeetup, deleteMeetup};