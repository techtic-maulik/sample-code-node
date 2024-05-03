import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-amazon';

@Injectable()
export class AmazonStrategy extends PassportStrategy(Strategy, 'amazon') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: 'http://localhost:3006/amazon/redirect',
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        const { id, displayName, email } = profile;

        const user = {
            id,
            displayName,
            email,
            // Add any other relevant user information
        };

        return user;
    }
}
