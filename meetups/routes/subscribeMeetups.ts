import express from "express";
import { isAuthenticated } from "../middleware/authentication.middleware";
import { subscribeController } from "../controllers/subscribeController";

const router = express.Router();

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
router.get("/subscribe/:id", isAuthenticated, subscribeController);

export default router;