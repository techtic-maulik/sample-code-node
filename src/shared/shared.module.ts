import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from './services';
import { PG } from '../modules/entity/tpg.entity';
import { Row } from '../modules/entity/tRow.entity';
import { Cell } from '../modules/entity/tCell.entity';
import { Col } from '../modules/entity/tCol.entity';
import { Data } from '../modules/entity/tData.entity';
import { Format } from '../modules/entity/tFormat.entity';
import { Item } from '../modules/entity/tItem.entity';
import { Share } from '../modules/entity/tShare.entity';
import { User } from '../modules/entity/tUser.entity';

const Entity = [PG, Row, Cell, Col, Data, Format, Item, Share, User];

@Module({
  imports: [TypeOrmModule.forFeature(Entity)],
  exports: [...Services, TypeOrmModule.forFeature(Entity)],
  providers: [...Services],
})
export class SharedModule {
  static forRoot(): DynamicModule {
    return {
      module: SharedModule,
      providers: [...Services],
    };
  }
}
