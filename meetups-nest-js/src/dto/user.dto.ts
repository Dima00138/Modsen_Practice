const Joi = require('joi');

/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} username - User name
 * @property {string} password - User password
 * @property {string} role - User role
 */

const userScheme = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string(),
})

export default userScheme;