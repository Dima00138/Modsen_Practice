import { User, PrismaClient } from "@prisma/client";
import userScheme from "../dto/user.dto";

export interface IUserRepository {
    createUser(data: Partial<User>) : Promise<User>;
    getUserById(id: number) : Promise<User | null>;
    getUserByPassword(name: string, password: string) : Promise<User | null>;
    getUserByRefreshToken(refreshToken: string) : Promise<User | null>;
    updateUser(id: number, updatedData: Partial<User>): Promise<User>;
}

export class UserRepository implements IUserRepository {
    private prisma : PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }


    createUser(data: Partial<User>): Promise<User> {
        const validData = userScheme.validate(data);
        return this.prisma.user.create({
            data: validData,
        });
    }

    getUserById(id: number) : Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                id: id
            }
        });
    }

    getUserByPassword(name: string, password: string) : Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                username: name,
                password: password
            }
        });
    }

    getUserByRefreshToken(refreshToken: string) : Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                refreshToken: refreshToken
            }
        });
    }

    updateUser(id: number, updatedData: Partial<User>) : Promise<User> {
        return this.prisma.user.update({
            where: { id: id },
            data: updatedData,
        });
    }
}

export default UserRepository;