import { ApiProperty } from "@nestjs/swagger";

const Joi = require('joi');

export class UserMeetupDto {
    @ApiProperty()
    userId: number;
    
    @ApiProperty()
    meetupId: number;
}

const userMeetupScheme = Joi.object({
    userId: Joi.number().required(),
    meetupId: Joi.number().required(),
})

export default userMeetupScheme;