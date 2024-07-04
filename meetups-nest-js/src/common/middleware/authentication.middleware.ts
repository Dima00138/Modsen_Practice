import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthorizationService } from "../../authorization/authorization.service";
import { MeetupsService } from "src/meetups/meetups.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class IsAuthenticatedMiddleware implements NestMiddleware {
	constructor(
		private readonly authService: AuthorizationService,
		private readonly meetupService: MeetupsService,
    private jwtService: JwtService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
      
        const user = await this.authService.getUserById(parseInt(req.user['sub']));
        if (!user || !user.refreshToken)
            throw new ForbiddenException('Access Denied');
        }
}