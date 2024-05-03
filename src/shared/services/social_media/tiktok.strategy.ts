import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';

@Injectable()
export class TikTokStrategy extends PassportStrategy(Strategy, 'tiktok') {
    constructor() {
        super({
            authorizationURL: 'https://tiktok.com/oauth/authorize',
            tokenURL: 'https://tiktok.com/oauth/access_token',
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: 'http://localhost:3006/tiktok/redirect',
            // scope: ['user.info.basic', 'user.info.avatar'],
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        return {
            accessToken,
            refreshToken,
            profile,
        };
    }
}