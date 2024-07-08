import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class SignInUserDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;
}

const signInUser = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

export default signInUser;