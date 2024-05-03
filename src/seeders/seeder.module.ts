import { Module, Logger } from '@nestjs/common';
import { Seeder } from './seeder';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigService as config } from '../common/config.service';

import { PG } from 'src/modules/entity/tpg.entity';
import { Share } from 'src/modules/entity/tShare.entity';
import { Col } from 'src/modules/entity/tCol.entity';
import { Row } from 'src/modules/entity/tRow.entity';
import { User } from 'src/modules/entity/tUser.entity';
import { Cell } from 'src/modules/entity/tCell.entity';
import { Item } from 'src/modules/entity/tItem.entity';
import { Data } from 'src/modules/entity/tData.entity';
import { Format } from 'src/modules/entity/tFormat.entity';
import { ExcelDataSeederService } from './excelData/excelData.service';
// console.log("hello-----");

/**
 * Import and provide seeder classes.
 *
 * @module
 */
const Entity = [PG, Share, Col, Row, User, Cell, Item, Data, Format];

const Services = [ExcelDataSeederService];
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [__dirname + '/../**/**.entity{.ts,.js}'],
        synchronize: false,
        migrationsRun: false,
        logging: false,
        logger: 'file' as 'file',
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        subscribers: [__dirname + '/subscribers/**/*{.ts,.js}'],
        cli: {
          // Location of migration should be inside src folder
          // to be compiled into dist/ folder.
          migrationsDir: 'src/migrations',
          subscribersDir: 'src/subscribers',
        },
        charset: 'utf8',
      }),
    }),
    TypeOrmModule.forFeature(Entity),
  ],
  providers: [Logger, Seeder, ...Services],
  exports: [],
})
export class SeederModule {}
