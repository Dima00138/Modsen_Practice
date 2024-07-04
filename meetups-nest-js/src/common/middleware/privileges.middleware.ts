import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthorizationService } from "../../authorization/authorization.service";
import { MeetupsService } from "src/meetups/meetups.service";

@Injectable()
export class IsPrivilegedMiddleware implements NestMiddleware {
	constructor(
		private readonly authService: AuthorizationService,
		private readonly meetupService: MeetupsService
        ) {}
    async use(req: Request, res: Response, next: NextFunction) {
      const user = await this.authService.getUserById(parseInt(req.user['sub'] || "0"));

   		if (user?.role !== "admin") {
        return res.status(401).json({error: 'Unprivileged access'});
    	}
        
    	if (req.method == "PUT" || req.method == "DELETE") {
        const { id } = req.params;
        const meetup = await this.meetupService.getMeetupById(parseInt(id));
        
        if (meetup?.userId !== user.id) {
            return res.status(401).json({error: 'Unprivileged access'});
        }
    }
    next();
    }
}