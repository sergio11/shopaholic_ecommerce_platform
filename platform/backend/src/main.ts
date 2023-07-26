import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new I18nValidationPipe())
  app.useGlobalFilters(new I18nValidationExceptionFilter({
    detailedErrors: false,
  }))
  const config = new DocumentBuilder()
    .setTitle('Shopaholic API')
    .setDescription('Shopaholic API description')
    .setVersion('1.0')
    .addTag('Shopaholic')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000, 'localhost');
}
bootstrap();
