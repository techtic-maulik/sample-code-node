import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';
import { SocialMediaService } from './socialMedia.service';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private socialMediaService: SocialMediaService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:4006/social-media/google/redirect',
      scope: ['email', 'profile', 'phone'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log({ profile });

    const { name, emails } = profile;
    const user = {
      firstName: name.givenName,
      lastName: name.familyName,
      email: emails,
      accessToken,
    };
    await this.socialMediaService.createUser(user);
    done(null, user);
  }
}
