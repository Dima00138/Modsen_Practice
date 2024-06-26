import { PrismaClient } from "@prisma/client";
import express from "express";
import {validateMeetup} from "../middleware/validation.middleware";
import { isAuthenticated, isPrivileged } from "../middleware/authentication.middleware";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @openapi
 * /meetups:
 *   get:
 *     summary: Retrieve a list of all meetups
 *     description: Returns a list of all meetups in the system.
 *     responses:
 *       200:
 *         description: List of meetups successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meetup'
 *       500:
 *         description: Error fetching meetups.
 */
router.get("/meetups", async (req, res) => {
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

        const result = await prisma.meetup.findMany({
            where: whereCondition,
            orderBy,
            take,
            skip,
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching meetups" });
    }
});

/**
 * @openapi
 * /meetups/{id}:
 *   get:
 *     summary: Retrieve information about a meetup by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifier of the meetup
 *     responses:
 *       200:
 *         description: Information about the meetup was successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meetup'
 *       404:
 *         description: Meetup with the specified ID not found.
 *       500:
 *         description: Error fetching meetup.
 */
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

/**
 * @openapi
 * /meetups:
 *   post:
 *     summary: Create a new meetup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meetup'
 *     responses:
 *       201:
 *         description: Meetup successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meetup'
 *       400:
 *         description: Error in input data validation.
 *       500:
 *         description: Failed to create meetup.
 */
router.post('/meetups', isAuthenticated, validateMeetup, isPrivileged, async (req, res) => {    
    try {  
        const newMeetup = await prisma.meetup.create({
            data: {
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags,
            time: req.body.time,
            location: req.body.location,
            userId: parseInt(req.user?.toString() ?? "0")
            },
        });
        res.status(201).json(newMeetup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create meetup" });
    }
});

  /**
 * @openapi
 * /meetups/{id}:
 *   put:
 *     summary: Update information about a meetup
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifier of the meetup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meetup'
 *     responses:
 *       200:
 *         description: Information about the meetup was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meetup'
 *       404:
 *         description: Meetup with the specified ID not found.
 *       500:
 *         description: Error updating meetup.
 */
router.put("/meetups/:id", isAuthenticated, validateMeetup, isPrivileged, async (req, res) => {
    const { id } = req.params;
    try {
        const updatedMeetup = await prisma.meetup.update({
            where: { id: Number(id) },
            data: {
                title: req.body.title,
                description: req.body.description,
                tags: req.body.tags,
                time: req.body.time,
                location: req.body.location,
            },
        });
        res.json(updatedMeetup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating meetup" });
    }
});

/**
 * @openapi
 * /meetups/{id}:
 *   delete:
 *     summary: Delete a meetup by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifier of the meetup
 *     responses:
 *       200:
 *         description: Meetup successfully deleted.
 *       500:
 *         description: Error deleting meetup.
 */
router.delete("/meetups/:id", isAuthenticated, isPrivileged, async (req, res) => {
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