const Joi = require('joi');

export interface UserDto {
    id: number;
    username: string;
    password: string;
    refreshToken: string,
    role: string;
}

const userScheme = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    refreshToken: Joi.string(),
    role: Joi.string(),
})

export default userScheme;