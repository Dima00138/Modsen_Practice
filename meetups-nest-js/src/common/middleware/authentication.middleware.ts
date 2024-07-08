import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserService } from "src/authorization/users.service";

@Injectable()
export class IsAuthenticatedMiddleware implements NestMiddleware {
	constructor(
		private readonly userService: UserService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        if (req.user === undefined) return next();
        const user = await this.userService.getUserById(parseInt(req.user['sub']));
        if (!user || user.refreshToken == user.id.toString() || user.refreshToken === user.username)
            throw new ForbiddenException('Access Denied');
        next();
        }
}