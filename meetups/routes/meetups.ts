import express from "express";
import {validateMeetup} from "../middleware/validation.middleware";
import { isAuthenticated, isPrivileged } from "../middleware/authentication.middleware";
import { createMeetup, deleteMeetup, getMeetupById, getMeetups, updateMeetup } from "../controllers/meetupController";

const router = express.Router();


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
router.get("/meetups", getMeetups);

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
router.get("/meetups/:id", getMeetupById);

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
router.post('/meetups', isAuthenticated, validateMeetup, isPrivileged, createMeetup);

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
router.put("/meetups/:id", isAuthenticated, validateMeetup, isPrivileged, updateMeetup);

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
router.delete("/meetups/:id", isAuthenticated, isPrivileged, deleteMeetup);

export default router;