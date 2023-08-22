import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
    new I18nValidationPipe(),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Shopaholic API')
    .setDescription('Shopaholic API description')
    .setVersion('1.0')
    .addTag('Shopaholic')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');
  await app.listen(port, '0.0.0.0', () => {
    console.log(`Server Started at 0.0.0.0:${port}`);
  });
}

bootstrap();
