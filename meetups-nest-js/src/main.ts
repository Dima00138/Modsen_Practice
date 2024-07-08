import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const config = new DocumentBuilder()
  .setTitle('Meetup API')
  .setDescription('API for managing meetups')
  .setVersion('1.0')
  .addSecurity('access-token', {
    type: 'apiKey', 
    in: 'cookie', 
    name: 'access-token',
  })
  .addSecurity('refresh-token', {
    type: 'apiKey', 
    in: 'cookie', 
    name: 'refresh-token',
  })
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
