import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:3000', // URL del frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Validación global
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 Team Tayta Backend is running on: http://localhost:${port}`);
}
void bootstrap();
