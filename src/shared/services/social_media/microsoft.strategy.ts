import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: 'http://localhost:3006/micorsoft/redirect',
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        const { id, displayName, userPrincipalName, emails } = profile;
        const user = {
            id,
            displayName,
            email: emails ? emails[0].value : userPrincipalName,
            // Add any other relevant user information
        };
        return user;
    }
}
