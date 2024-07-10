import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type JwtPayload = {
  sub: number;
  username: string;
  role: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly logger = new Logger("RefreshToken");
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.ExtractJWT,
      ]),
      secretOrKey: configService.get<string>('REFRESH-SECRET'),
      passReqToCallback: true,
    });
  }

  private static ExtractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'refreshToken' in req.cookies &&
      req.cookies.refreshToken.length > 0
    ) {
      return req.cookies.refreshToken;
    }
    return null;
  }

  validate(req: Request, payload: JwtPayload) {
    req.user = payload;
    return payload;
  }
}
