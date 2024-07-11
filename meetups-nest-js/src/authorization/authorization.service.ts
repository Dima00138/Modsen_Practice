import { BadRequestException, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './users.service';
import { ApiProperty } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './types/tokens';

@Injectable()
export class AuthorizationService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly configService: ConfigService) {}

   

    async signIn(username: string, pass: string): Promise<Tokens> {
        const user = await this.userService.getUserByPassword(username, pass);
        if (!user) {
          throw new UnauthorizedException();
        }
        const tokens = await this.getTokens(user.id, user.username, user.role);
        await this.userService.updateRefreshToken(user.id, tokens.refreshToken)
        return tokens;
    }

    async logout(userId: number) : Promise<User> {
        return this.userService.updateRefreshToken(userId, userId.toString());
    }

    async register(username: string, password: string): Promise<User> {
      const user = await this.userService.createUser({
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

    async refreshTokens(userId: number, refreshToken: string) : Promise<Tokens> {
      const user = await this.prismaService.user.findUnique({
          where: {
              id: userId,
              refreshToken: refreshToken
          }
      });

    if(!user || 
      user.refreshToken == user.id.toString() || 
      user.refreshToken === user.username) 
        throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, user.username, user.role);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
    }

    async getTokens(userId: number, username: string, role: string) : Promise<Tokens> {
        const [accessToken, refreshToken] = await Promise.all([
          this.jwtService.signAsync(
            {
              sub: userId,
              username,
              role: role
            },
            {
              secret: this.configService.get<string>('REFRESH-SECRET'),
              expiresIn: '15m',
            },
          ),
          this.jwtService.signAsync(
            {
              sub: userId,
              username,
              role: role
            },
            {
              secret: this.configService.get<string>('ACCESS-SECRET'),
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
