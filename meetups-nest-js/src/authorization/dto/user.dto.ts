import { ApiProperty } from "@nestjs/swagger";

const Joi = require('joi');

export class UserDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    refreshToken: string;

    @ApiProperty()
    role: string;
}

const userScheme = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    refreshToken: Joi.string(),
    role: Joi.string(),
})

export default userScheme;