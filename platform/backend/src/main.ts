import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new I18nValidationPipe())
  app.useGlobalFilters(new I18nValidationExceptionFilter({
    detailedErrors: false,
  }))
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Shopaholic API')
    .setDescription('Shopaholic API description')
    .setVersion('1.0')
    .addTag('Shopaholic')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');
  const baseUrl: string = config.get<string>('BASE_URL');
  await app.listen(port, baseUrl, () => {
    console.log(`Server Started at %${baseUrl}:%${port}`);
  });
}
bootstrap();
