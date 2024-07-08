import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/database.service";
import userScheme from "./dto/user.dto";
import { User } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: Partial<User>): Promise<User> {
    const validData = userScheme.validate(data);
    
    return this.prismaService.user.create({
        data: validData.value,
    });
}

async getUserById(id: number) : Promise<User | null> {
    return this.prismaService.user.findUnique({
        where: {
            id: id
        }
    });
}

async getUserByPassword(name: string, password: string) : Promise<User | null> {
    return this.prismaService.user.findUnique({
        where: {
            username: name,
            password: password
        }
    });
}

async getUserByRefreshToken(refreshToken: string) : Promise<User | null> {
    return this.prismaService.user.findUnique({
        where: {
            refreshToken: refreshToken
        }
    });
}

async updateRefreshToken(userId: number, refreshToken: string) {
  return this.prismaService.user.update({
      where: {
          id: userId
      },
      data: {
        refreshToken: refreshToken
      }
  });
}

async updateUser(id: number, updatedData: Partial<User>) : Promise<User> {
    return this.prismaService.user.update({
        where: { id: id },
        data: updatedData,
    });
}
}