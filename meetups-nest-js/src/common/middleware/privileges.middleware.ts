import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { MeetupService } from "src/meetups/meetups.service";
import { UserService } from "src/authorization/users.service";

@Injectable()
export class IsPrivilegedMiddleware implements NestMiddleware {
    private readonly logger = new Logger("IsPrivilegedMiddleware");
	constructor(
		private readonly userService: UserService,
		private readonly meetupService: MeetupService
        ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        this.logger.debug(`Processing request method: ${req.method}`);
        if (req.user === undefined) {
            this.logger.warn('User not authenticated');
            return next();
          }
          const user = await this.userService.getUserById(parseInt(req.user['sub'] || "0"));
          
          if (req.method == "PUT" || req.method == "DELETE") {
            const { id } = req.params;
            const meetup = await this.meetupService.getMeetupById(parseInt(id));
            
            if (meetup?.userId !== user.id) {
              this.logger.error('Unprivileged access attempt');
              return res.status(401).json({error: 'Unprivileged access'});
            }
          }
    this.logger.debug('Access granted');
    next();
    }
}