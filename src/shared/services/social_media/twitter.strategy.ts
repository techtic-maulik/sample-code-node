// twitter.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitter';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
    constructor() {
        super({
            consumerKey: process.env.GOOGLE_CLIENT_ID,
            consumerSecret: process.env.GOOGLE_SECRET,
            // clientID: process.env.GOOGLE_CLIENT_ID,
            // clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: 'http://localhost:3006/twitter/redirect',
        });
    }

    async validate(token: string, tokenSecret: string, profile: any): Promise<any> {
        const { id, displayName, username } = profile;

        const user = {
            id,
            displayName,
            username,
            // Add any other relevant user information
        };

        return user;
    }
}
