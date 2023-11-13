import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as compression from 'compression'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('v1/api')
  //config documentation
  const config = new DocumentBuilder()
    .setTitle('Api de recetas V1')
    .setDescription(
      'Bienvenido a la **Recipes API**, explora una colección de recetas de cocina de todos los rincones del planeta y más allá. Desde platos regionales auténticos hasta creaciones innovadoras, comparte y disfruta de la diversidad de la gastronomía global con facilidad.'
    )
    .setVersion('1.0')
    .setContact('Elver David Peñate', 'https://elvportafolio.website', '')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  //Cors
  app.enableCors()
  //security headers
  app.use(helmet())
  //Validations
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )
  app.use(compression())

  await app.listen(parseInt(process.env.PORT) || 8080)
}
bootstrap()
