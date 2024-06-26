import { PrismaClient } from "@prisma/client";
import express from "express";
import { isAuthenticated } from "../middleware/authentication.middleware";

const router = express.Router();
const prisma = new PrismaClient();


/**
 * @swagger
 * /subscribe/{id}:
 *   get:
 *     summary: Subscribe a user to a meetup
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: User or meetup not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: An error occurred while subscribing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/subscribe/:id",isAuthenticated, async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(req.user?.toString() ?? "0")
            }
        });

        const meetup = await prisma.meetup.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if (!user || !meetup) {
            return res.status(404).json({ error: "User or meetup not found" });
        }

        await prisma.userMeetup.create({
            data: {
                userId: user?.id,
                meetupId: meetup?.id,
            },
        });

        res.status(200).json({ message: "Subscribed to meetup" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while subscribing" });
  }
});

export default router;