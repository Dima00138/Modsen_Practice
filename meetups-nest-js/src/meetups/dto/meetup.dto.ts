import { ApiProperty } from "@nestjs/swagger";

const Joi = require('joi');

export class MeetupDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ type: [String] })
    tags: string[];

    @ApiProperty()
    time: Date;

    @ApiProperty()
    location: string;
    
    @ApiProperty()
    userId: number;
}

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