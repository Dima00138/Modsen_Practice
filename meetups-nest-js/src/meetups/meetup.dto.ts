const Joi = require('joi');

export interface MeetupDto {
    id: number;
    title: string;
    description: string;
    tags: string[];
    time: Date;
    location: string;
    userId: number;
}

const meetupScheme = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    tags: Joi.array().items(
        Joi.string().required()
    ),
    time: Joi.string().isoDate().required(),
    location: Joi.string().uri().required(),
    userId: Joi.number(),
})

export default meetupScheme;