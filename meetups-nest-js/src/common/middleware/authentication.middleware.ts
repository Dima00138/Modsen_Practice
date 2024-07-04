import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthorizationService } from "../../authorization/authorization.service";
import { MeetupService } from "src/meetups/meetups.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class IsAuthenticatedMiddleware implements NestMiddleware {
	constructor(
		private readonly authService: AuthorizationService,
		private readonly meetupService: MeetupService,
    private jwtService: JwtService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const user = await this.authService.getUserById(parseInt(req.user['sub']));
        if (!user || user.refreshToken == user.id.toString() || user.refreshToken === user.username)
            throw new ForbiddenException('Access Denied');
        }
}