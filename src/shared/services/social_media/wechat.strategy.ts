// wechat.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-wechat';

@Injectable()
export class WeChatStrategy extends PassportStrategy(Strategy, 'wechat') {
    constructor() {
        super({
            appID: process.env.GOOGLE_CLIENT_ID,
            appSecret: process.env.GOOGLE_SECRET,
            // clientID: process.env.GOOGLE_CLIENT_ID,
            // clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: 'http://localhost:3006/wechat/redirect',
            scope: 'snsapi_login',
            state: true,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        const { openid, nickname, unionid } = profile;

        const user = {
            id: openid,
            nickname,
            unionid,
            // Add any other relevant user information
        };

        return user;
    }
}
