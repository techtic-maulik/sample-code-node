import { Module } from '@nestjs/common';
import { SocialMediaService } from '../../shared/services/social_media/socialMedia.service';
import { SocialMediaController } from './social_media.controller';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [SocialMediaController],
  providers: [SocialMediaService],
})
export class SocialMediaModule {}
