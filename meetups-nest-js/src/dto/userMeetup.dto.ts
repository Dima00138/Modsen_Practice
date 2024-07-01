const Joi = require('joi');

/**
 * @typedef {Object} UserMeetup
 * @property {number} userId - User ID
 * @property {number} meetupId - Meetup ID
 */

const userMeetupScheme = Joi.object({
    userId: Joi.number().required(),
    meetupId: Joi.number().required(),
})

export default userMeetupScheme;