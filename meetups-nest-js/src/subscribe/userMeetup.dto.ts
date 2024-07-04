const Joi = require('joi');

export interface UserMeetupDto {
    userId: number;
    meetupId: number;
}

const userMeetupScheme = Joi.object({
    userId: Joi.number().required(),
    meetupId: Joi.number().required(),
})

export default userMeetupScheme;