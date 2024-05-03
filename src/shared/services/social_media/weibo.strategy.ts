// weibo.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-weibo';

@Injectable()
export class WeiboStrategy extends PassportStrategy(Strategy, 'weibo') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            // clientID: process.env.GOOGLE_CLIENT_ID,
            // clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: 'http://localhost:3006/weibo/redirect',
        });
    }

    async validate(token: string, tokenSecret: string, profile: any): Promise<any> {
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
