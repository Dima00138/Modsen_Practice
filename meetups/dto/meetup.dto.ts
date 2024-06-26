const Joi = require('joi');

/**
 * @typedef {Object} Meetup
 * @property {number} id - Meetup ID
 * @property {string} title - Meetup title
 * @property {string} description - Meetup description
 * @property {string[]} tags - Meetup tags
 * @property {string} time - The time of the meetup in ISO format
 * @property {string} location - Meetup location
 * @property {number} userId - Meetups creator id
 */

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