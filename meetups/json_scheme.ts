const Joi = require('joi');

const meetUp = Joi.object({
    title: Joi.string().alphanum(),
    description: Joi.string(),
    tags: Joi.array().items(
        Joi.string()
    ),
    time: Joi.date(),
    location: Joi.string().uri()
})