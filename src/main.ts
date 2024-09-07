import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    cors: true,
  });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.useGlobalPipes(new ValidationPipe());
  const configDocument = new DocumentBuilder()
    .setTitle('Rentcos API')
    .setDescription("Rentcos's API documentation")
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, configDocument);
  SwaggerModule.setup('api', app, document);
  await app.listen(port);
}
bootstrap();
