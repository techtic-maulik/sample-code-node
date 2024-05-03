import { Module } from '@nestjs/common';
import { ColumnService } from '../../shared/services/column/column.service';
import { ColumnController } from './column.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [ColumnController],
  providers: [ColumnService],
})
export class ColumnModule {}
