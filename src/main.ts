import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1/api');
  //config documentation
  const config = new DocumentBuilder()
    .setTitle('Api de recetas V1')
    .setDescription(
      'API que permite gestionar y explorar recetas de cocina, junto con sus categorías asociadas.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  //Cors
  app.enableCors();
  //security headers
  app.use(helmet());
  //Validations
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const configService = app.get(ConfigService);
  console.log(configService.get('API_KEY'));
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
