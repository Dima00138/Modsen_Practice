import { Request, Response } from "express";
import MeetupRepository from "../repositories/meetupRepository";
import UserRepository from "../repositories/userRepository";
import UserMeetupRepository from "../repositories/userMeetupRepository";

const userRepository = new UserRepository();
const meetupRepository = new MeetupRepository();
const userMeetupRepository = new UserMeetupRepository();

export const subscribeController = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await userRepository.getUserById(parseInt(req.user?.toString() || "0"));

        const meetup = await meetupRepository.getMeetupById(parseInt(id));

        if (!user || !meetup) {
            return res.status(404).json({ error: "User or meetup not found" });
        }

        await userMeetupRepository.createUserMeetup({
            userId: user?.id,
            meetupId: meetup?.id,
        });

        res.json("Subscribed to meetup");
    } catch (error) {
        res.status(500).json({ error: "An error occurred while subscribing" });
  }
};

export default {subscribeController};