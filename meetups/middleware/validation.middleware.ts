import { Request, Response, NextFunction } from 'express';
import meetupScheme from '../dto/meetup.dto';
import userScheme from '../dto/user.dto';

export const validateMeetup = (req: Request, res: Response, next: NextFunction) => {
  const { error } = meetupScheme.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const { error } = userScheme.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

export default {validateMeetup, validateUser}