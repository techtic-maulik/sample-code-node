import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { SocialMediaService } from '../../shared/services/social_media/socialMedia.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('social-media')
export class SocialMediaController {
  constructor(private socialMediaService: SocialMediaService) {}

  @Get('amazon')
  @UseGuards(AuthGuard('amazon'))
  async amazonLogin() {}

  @Get('amazon/callback')
  @UseGuards(AuthGuard('amazon'))
  async amazonCallback(@Req() req) {
    return {
      message: 'Amazon login successful',
      user: req.user,
    };
  }

  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  async appleLogin() {}

  @Get('apple/callback')
  @UseGuards(AuthGuard('apple'))
  async appleCallback(@Req() req) {
    return {
      statusCode: HttpStatus.OK,
      user: req.user,
    };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.socialMediaService.googleLogin(req);
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }

  @Get('/instagram')
  @UseGuards(AuthGuard('instagram'))
  async instagramLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/instagram/redirect')
  @UseGuards(AuthGuard('instagram'))
  async instagramLoginRedirect(@Req() req): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }

  @Get('/linkdin')
  @UseGuards(AuthGuard('linkdin'))
  async linkdinLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/linkdin/redirect')
  @UseGuards(AuthGuard('linkdin'))
  async linkdinLoginRedirect(@Req() req): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }

  @Get('tiktok')
  @UseGuards(AuthGuard('tiktok'))
  async tiktokLogin() {}

  @Get('tiktok/callback')
  @UseGuards(AuthGuard('tiktok'))
  async tiktokCallback(@Req() req): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      user: req.user,
    };
  }

  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftLogin() {}

  @Get('microsoft/callback')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftCallback(@Req() req) {
    return {
      statusCode: HttpStatus.OK,
      user: req.user,
    };
  }

  @Get('twitter')
  @UseGuards(AuthGuard('twitter'))
  async twitterLogin() {}

  @Get('twitter/callback')
  @UseGuards(AuthGuard('twitter'))
  async twitterCallback(@Req() req) {
    return {
      statusCode: HttpStatus.OK,
      user: req.user,
    };
  }

  @Get('wechat')
  @UseGuards(AuthGuard('wechat'))
  async wechatLogin() {}

  @Get('wechat/callback')
  @UseGuards(AuthGuard('wechat'))
  async wechatCallback(@Req() req) {
    return {
      statusCode: HttpStatus.OK,
      user: req.user,
    };
  }

  @Get('weibo')
  @UseGuards(AuthGuard('weibo'))
  async weiboLogin() {}

  @Get('weibo/callback')
  @UseGuards(AuthGuard('weibo'))
  async weiboCallback(@Req() req) {
    return {
      statusCode: HttpStatus.OK,
      user: req.user,
    };
  }

  @Get('/test')
  @ApiOkResponse({ description: 'Successfully authenticated' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async getTGById(@Res() res: Response): Promise<any> {
    let userData = {
      profile: {
        id: '110453883116825965121',
        displayName: 'Hiral Gajre',
        name: { familyName: 'Gajre', givenName: 'Hiral' },
        emails: [[Object]],
        photos: [[Object]],
        provider: 'google',
        _raw:
          '{\n' +
          '  "sub": "110453883116825965121",\n' +
          '  "name": "Hiral Gajre",\n' +
          '  "given_name": "Hiral",\n' +
          '  "family_name": "Gajre",\n' +
          '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocKyYIiJOJIWmwI7_8360jS_ifyptpKkjOgAIhsTUloi\\u003ds96-c",\n' +
          '  "email": "techtic.hiralgajre@gmail.com",\n' +
          '  "email_verified": true,\n' +
          '  "locale": "en"\n' +
          '}',
        _json: {
          sub: '110453883116825965121',
          name: 'Hiral Gajre',
          given_name: 'Hiral',
          family_name: 'Gajre',
          picture:
            'https://lh3.googleusercontent.com/a/ACg8ocKyYIiJOJIWmwI7_8360jS_ifyptpKkjOgAIhsTUloi=s96-c',
          email: 'techtic.hiralgajre@gmail.com',
          email_verified: true,
          locale: 'en',
        },
      },
    };
    return await this.socialMediaService
      .createUser(userData)

      .then(async (response) => {
        return res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          data: response,
        });
      })
      .catch((error: any) => {
        throw new UnprocessableEntityException(error);
      });
  }
}
