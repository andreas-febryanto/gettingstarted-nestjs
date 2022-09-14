import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const serverConfig = config.get('server');
  // const YAML_CONFIG_FILENAME = 'default.yaml';
  // const data = yaml.load(
  //   readFileSync(join(__dirname, `../config/${YAML_CONFIG_FILENAME}`), 'utf-8'),
  // ) as Record<string, any>;
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'development') app.enableCors();

  const port = process.env.PORT || serverConfig.port;
  logger.log(`Application listening on port ${port}`);
  await app.listen(port);
}
bootstrap();
