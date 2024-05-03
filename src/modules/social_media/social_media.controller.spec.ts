import { Test, TestingModule } from '@nestjs/testing';
import { SocialMediaController } from './social_media.controller';
import { TgService } from '../../shared/services/tg/tg.service';

describe('SocialMediaController', () => {
  let controller: SocialMediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialMediaController],
      providers: [TgService],
    }).compile();

    controller = module.get<SocialMediaController>(SocialMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
