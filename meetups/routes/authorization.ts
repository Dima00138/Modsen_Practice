import { PrismaClient } from "@prisma/client";
import express from "express";
import {generateAccessToken, generateRefreshToken} from '../middleware/authentication.middleware';
import {validateUser} from "../middleware/validation.middleware";

const router = express.Router();
const prisma = new PrismaClient();


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
router.post("/login", validateUser, async (req, res) => {
    const name = req.body.username;
    const pass = req.body.password;

    const user = await prisma.user.findUnique({
        where: {
            username: name,
            password: pass
        }
    })
  
    if (user) {
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        user.refreshToken = refreshToken;

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: user
        });
  
        res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict'});
  
        res.json(updatedUser);
    } else {
        res.json({error: "User not found"});
    }
})

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout user
 *     description: Clear user cookies and refresh token
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get("/logout", async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (refreshToken) {
        const user = await prisma.user.findUnique({
            where: {
                refreshToken: refreshToken
            }
        });
        if (user) {
            user.refreshToken = "";
            await prisma.user.update({
                where: {id: user.id},
                data: user
            })
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
  }
})

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
router.post('/register', validateUser, async (req, res) => {
    try {
       const { username, password } = req.body;
       const user = await prisma.user.create({
         data: {
            username: username,
            password: password,
            refreshToken: "",
            role: "user"
         }
       });
       res.status(201).json(user);
    } catch (error) {
       res.status(500).json({error: "Failed to register user"})
    }
});

export default router;