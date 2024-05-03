import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TgModule } from './modules/tg/tg.module';
import { SocialMediaModule } from './modules/social_media/social_media.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SharedModule } from './shared/shared.module';
import { RowModule } from './modules/row/row.module';
import { ColumnModule } from './modules/column/column.module';
import ormconfig from './ormconfig_for_module';

@Module({
  imports: [
    forwardRef(() => SharedModule.forRoot()),
    TypeOrmModule.forRoot(ormconfig),

    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'cats_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    TgModule,
    SocialMediaModule,
    RowModule,
    ColumnModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
