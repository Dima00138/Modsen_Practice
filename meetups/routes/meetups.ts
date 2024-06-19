import { PrismaClient } from "@prisma/client";
import express from "express";
import validationMeetup from "../middleware/validation.middleware";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/meetups", async (req, res) => {
    try {
        const meetups = await prisma.meetup.findMany();
        res.json(meetups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching meetups" });
    }
});

router.get("/meetups/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const meetup = await prisma.meetup.findUnique({
            where: { id: Number(id) },
        });

        if (!meetup) 
            return res.status(404).json({ error: "Meetup not found" });

        res.json(meetup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching meetup" });
    }
});

router.post('/meetups', validationMeetup, async (req, res) => {
    try {
      const newMeetup = await prisma.meetup.create({
        data: {
          title: req.body.title,
          description: req.body.description,
          tags: req.body.tags,
          time: req.body.time,
          location: req.body.location,
        },
      });
  
      res.status(201).json(newMeetup);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create meetup' });
    }
  });

router.put("/meetups/:id", validationMeetup, async (req, res) => {
    const { id } = req.params;
    const { title, description, tags, time, location } = req.body;
    try {
        const updatedMeetup = await prisma.meetup.update({
            where: { id: Number(id) },
            data: {
            title,
            description,
            tags: tags.split(","),
            time,
            location,
            },
        });
        res.json(updatedMeetup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating meetup" });
    }
});

router.delete("/meetups/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedMeetup = await prisma.meetup.delete({
            where: { id: Number(id) },
    });
        res.json(deletedMeetup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting meetup" });
    }
});

export default router;
module.exports = router;