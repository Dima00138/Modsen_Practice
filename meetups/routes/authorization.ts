import { PrismaClient } from "@prisma/client";
import express from "express";
import {generateAccessToken, generateRefreshToken} from '../middleware/authentication.middleware';
import {validateUser} from "../middleware/validation.middleware";

const router = express.Router();
const prisma = new PrismaClient();

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