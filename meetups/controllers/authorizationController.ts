import UserRepository from "../repositories/userRepository";
import { Request, Response } from "express";
import {generateAccessToken, generateRefreshToken} from '../middleware/authentication.middleware';

const repository = new UserRepository();

export const registerController = async (req: Request, res: Response) => {
    try {
       const { username, password } = req.body;
       const user = await repository.createUser({
        username: username,
        password: password,
        refreshToken: username,
        role: "user"
     });
       res.status(201).json(user);
    } catch (error) {
       res.status(500).json({error: "Failed to register user"})
    }
};

export const loginController = async (req: Request, res: Response) => {
    const name = req.body.username;
    const pass = req.body.password;

    const user = await repository.getUserByPassword(name, pass);
  
    if (user) {
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        user.refreshToken = refreshToken;
        const updatedUser = await repository.updateUser(user.id, user);
  
        res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "strict" });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict"});
  
        res.json(updatedUser);
    } else {
        res.json({error: "User not found"});
    }
};

export const logoutController = async (req: Request, res: Response) => {
    req.user = undefined;
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
        const user = await repository.getUserByRefreshToken(refreshToken);
        if (user) {
            user.refreshToken = user.username;
            await repository.updateUser(user.id, user);
        }
    }
    res.clearCookie("connect.sid");
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json(true);
};

export default {loginController, logoutController, registerController};