import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const accessSecret = 'access-secret';
const prisma = new PrismaClient();
const refreshSecret = 'refresh-secret';

export const generateAccessToken = (id: number) => {
    return jwt.sign({ id: id }, accessSecret, { expiresIn: '10m' });
};
  
export const generateRefreshToken = (id: number) => {
    return jwt.sign({ id: id }, refreshSecret, { expiresIn: '24h' });
};

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({error: 'Unauthenticated access'});
    }

    if (accessToken) {
        jwt.verify(accessToken, accessSecret, async (err: any, decoded: any) => {
            if (err) {
                return res.status(401).json({error: 'Unauthenticated access'});
            }
            const user = await prisma.user.findUnique({
                where: {
                    id: decoded.id
                }
            })
            if (!user) {
                return res.status(401).json({error: 'Unauthenticated access'});
            }
            req.user = decoded.id;
            next();
        })
    }
    if (refreshToken) {
        jwt.verify(refreshToken, refreshSecret, async (err: any, decoded: any) => {
            if (err) {
                return res.status(401).json({error: 'Unauthenticated access'});
            }
            
            const user = await prisma.user.findUnique({
                where: {
                    refreshToken: refreshToken,
                    id: decoded.id
                }
            })
            if (!user) {
                return res.status(401).json({error: 'Unauthenticated access'});
            }
            
            const newAccessToken = generateAccessToken(user.id);
            req.user = decoded.id;
            res.cookie('accessToken', newAccessToken);

            next();
          });
    }
};

export default {isAuthenticated, generateAccessToken, generateRefreshToken};