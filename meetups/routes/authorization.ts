import express from "express";
import {validateUser} from "../middleware/validation.middleware";
import { loginController, logoutController, registerController } from "../controllers/authorizationController";

const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticate user and return access and refresh tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.post("/login", validateUser, loginController);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user
 *     description: Clear user cookies and refresh token
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.post("/logout", logoutController);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register new user
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Failed to register user
 */
router.post('/register', validateUser, registerController);

export default router;