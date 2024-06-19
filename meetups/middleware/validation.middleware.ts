import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import meetupScheme from '../dto/meetup.dto';

const validateMeetup = (req: Request, res: Response, next: NextFunction) => {
  const { error } = meetupScheme.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

export default validateMeetup;