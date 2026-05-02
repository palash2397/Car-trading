//   /$$$$$$   /$$$$$$  /$$$$$$$       /$$$$$$$$ /$$$$$$$   /$$$$$$  /$$$$$$$  /$$$$$$ /$$   /$$  /$$$$$$
//  /$$__  $$ /$$__  $$| $$__  $$     |__  $$__/| $$__  $$ /$$__  $$| $$__  $$|_  $$_/| $$$ | $$ /$$__  $$
// | $$  \__/| $$  \ $$| $$  \ $$        | $$   | $$  \ $$| $$  \ $$| $$  \ $$  | $$  | $$$$| $$| $$  \__/
// | $$      | $$$$$$$$| $$$$$$$/ /$$$$$$| $$   | $$$$$$$/| $$$$$$$$| $$  | $$  | $$  | $$ $$ $$| $$ /$$$$
// | $$      | $$__  $$| $$__  $$|______/| $$   | $$__  $$| $$__  $$| $$  | $$  | $$  | $$  $$$$| $$|_  $$
// | $$    $$| $$  | $$| $$  \ $$        | $$   | $$  \ $$| $$  | $$| $$  | $$  | $$  | $$\  $$$| $$  \ $$
// |  $$$$$$/| $$  | $$| $$  | $$        | $$   | $$  | $$| $$  | $$| $$$$$$$/ /$$$$$$| $$ \  $$|  $$$$$$/
//  \______/ |__/  |__/|__/  |__/        |__/   |__/  |__/|__/  |__/|_______/ |______/|__/  \__/ \______/

import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { join } from 'path';

import morgan from 'morgan';

import constants from './constants';
const { SWAGGER, Global } = constants;

async function bootstrap() {

    
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // morgan for logging
  app.use(morgan('dev'));

  // Serve uploaded files statically
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // 🔥 enable global validation for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 🔥 cors
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


  // 🔥 WebSocket Adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  // Global Prefix
  app.setGlobalPrefix(Global.PREFIX);

  // 🔥 Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle(SWAGGER.TITLE)
    .setDescription(SWAGGER.DESCRIPTION)
    .setVersion(SWAGGER.VERSION)
    // .addServer(SWAGGER.SERVER_URL)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`${Global.PREFIX}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  }); 
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 4007);
  console.log(`🚀 Car trading server is running on port ${process.env.PORT}`);
}
bootstrap();

// taskkill /F /IM node.exe
// kill-port 4007
// npm run start:dev
