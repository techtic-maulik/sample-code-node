import { Module } from '@nestjs/common';
import { RowService } from '../../shared/services/row/row.service';
import { RowController } from './row.controller';
import { SharedModule } from '../../shared/shared.module';
import { PostgreSQLService } from 'src/common/postgresql.service';

@Module({
  imports: [SharedModule],
  controllers: [RowController],
  providers: [RowService, PostgreSQLService],
})
export class RowModule {}
