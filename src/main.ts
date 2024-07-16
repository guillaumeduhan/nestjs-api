import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // prefix
  app.setGlobalPrefix('v4');
  // swagger
  const config = new DocumentBuilder()
    .setTitle('Client-Api-V4')
    .setDescription('The Client-Api-V4 API description')
    .setVersion('1.0')
    .addTag('client-api-v4')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log(`APP LAUNCHED AT ${process.env.PORT}`)
  await app.listen(process.env.PORT);
}
bootstrap();
