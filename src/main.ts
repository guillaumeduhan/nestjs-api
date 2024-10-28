import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // prefix 
  app.setGlobalPrefix('v4');
  // swagger
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Tax-Api-V4')
      .setDescription('The Tax-Api-V4 API description')
      .setVersion('1.0')
      .addTag('tax-api-v4')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
        'access-token',)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  console.log(`APP LAUNCHED AT ${process.env.PORT}`)
  await app.listen(process.env.PORT);
}
bootstrap();
