import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/database.service';
import userScheme from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthorizationService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService) {}

    async createUser(data: Partial<User>): Promise<User> {
        const validData = userScheme.validate(data);
        return this.prismaService.user.create({
            data: validData,
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

    async signIn(username: string, pass: string): Promise<{ accessToken: string, refreshToken: string }> {
        const user = await this.getUserByPassword(username, pass);
        if (!user) {
          throw new UnauthorizedException();
        }
        const tokens = await this.getTokens(user.id, user.username);
        await this.updateRefreshToken(user.id, tokens.refreshToken)
        return tokens;
      }

      async logout(userId: number) {
        return this.updateRefreshToken(userId, userId.toString());
      }

    async register(username: string, password: string): Promise<User> {
      const user = await this.createUser({
        username: username,
        password: password,
        refreshToken: username,
        role: "user"
      });
      if (!user) {
        throw new BadRequestException();
      }
      return user;
    }

    async refreshTokens(userId: number, refreshToken: string) {
      const user = await this.prismaService.user.findUnique({
          where: {
              id: userId
          }
      });

    if(!user || user.refreshToken == user.id.toString() || user.refreshToken === user.username) 
      throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, user.username);

    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
    }

    async getTokens(userId: number, username: string) {
        const [accessToken, refreshToken] = await Promise.all([
          this.jwtService.signAsync(
            {
              sub: userId,
              username,
            },
            {
              secret: 'access-secret',
              expiresIn: '15m',
            },
          ),
          this.jwtService.signAsync(
            {
              sub: userId,
              username,
            },
            {
              secret: 'refresh-secret',
              expiresIn: '3d',
            },
          ),
        ]);
    
        return {
          accessToken,
          refreshToken,
        };
    }

}
