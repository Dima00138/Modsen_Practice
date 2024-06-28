import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../repositories/userRepository';
import { MeetupRepository } from "../repositories/meetupRepository";

const prisma = new PrismaClient();
const meetupRepository = new MeetupRepository();
const userRepository = new UserRepository();
const accessSecret = 'access-secret';
const refreshSecret = 'refresh-secret';


export const generateAccessToken = (id: number) => {
    return jwt.sign({ id: id }, accessSecret, { expiresIn: "10m" });
};
  
export const generateRefreshToken = (id: number) => {
    return jwt.sign({ id: id }, refreshSecret, { expiresIn: "24h" });
};

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({error: "Unauthorized access"});
    }

    if (accessToken) {
        jwt.verify(accessToken, accessSecret, async (err: any, decoded: any) => {
            if (err) {
                return res.status(401).json({error: "Unauthorized access"});
            }
            const user = await userRepository.getUserById(parseInt(decoded.id));
            if (!user) {
                return res.status(401).json({error: "Unauthorized access"});
            }
            req.user = user.id;
            next();
        })
    }
    if (refreshToken && !accessToken) {
        jwt.verify(refreshToken, refreshSecret, async (err: any, decoded: any) => {
            if (err) {
                return res.status(401).json({error: "Unauthorized access"});
            }
            
            const user = await userRepository.getUserByRefreshToken(refreshToken);
            if (!user) {
                return res.status(401).json({error: "Unauthorized access"});
            }
            
            const newAccessToken = generateAccessToken(user.id);
            req.user = user.id;
            res.cookie("accessToken", newAccessToken);
            next();
          });
    }
};

export const isPrivileged = async (req: Request, res: Response, next: NextFunction) => {    
    const user = await userRepository.getUserById(parseInt(req.user?.toString() || "0"));

    if (user?.role !== "admin") {
        return res.status(401).json({error: 'Unprivileged access'});
    }
    if (req.method == "PUT" || req.method == "DELETE") {
        const { id } = req.params;
        const meetup = await meetupRepository.getMeetupById(parseInt(id));
        
        if (meetup?.userId !== user.id) {
            return res.status(401).json({error: 'Unprivileged access'});
        }
    }
    next();
}

export default {isAuthenticated, generateAccessToken, generateRefreshToken, isPrivileged};