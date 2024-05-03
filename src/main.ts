import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/public' });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.APP_PORT);
  console.log('project started at port: ' + process.env.APP_PORT);
}
bootstrap();
