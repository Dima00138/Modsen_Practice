import * as Joi from 'joi';

export interface UserDto {
    username: string;
    password: string;
}

const signInUser = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

export default signInUser;