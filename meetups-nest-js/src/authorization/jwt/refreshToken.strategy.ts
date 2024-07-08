import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, Logger } from '@nestjs/common';

type JwtPayload = {
  sub: number;
  username: string;
  role: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly logger = new Logger("RefreshToken");
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "refresh-secret",
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    this.logger.debug(refreshToken);
    req.user = payload;
    return { ...payload, refreshToken };
  }
}
