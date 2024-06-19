const Joi = require('joi');

const meetupScheme = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    tags: Joi.array().items(
        Joi.string().required()
    ),
    time: Joi.string().isoDate().required(),
    location: Joi.string().uri().required()
})

export default meetupScheme;