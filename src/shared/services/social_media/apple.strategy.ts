import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-apple';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: 'http://localhost:3006/apple/redirect',
        });
    }

    async validate(
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        // You can customize this method to save the user profile in your database
        const user = {
            id: profile.id,
            email: profile.email,
            // Add any other relevant user information
        };
        return done(null, user);
    }
}
