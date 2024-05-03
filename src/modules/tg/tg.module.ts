import { Module } from '@nestjs/common';
import { TgService } from '../../shared/services/tg/tg.service';
import { TgController } from './tg.controller';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [TgController],
  providers: [TgService],
})
export class TgModule {}
