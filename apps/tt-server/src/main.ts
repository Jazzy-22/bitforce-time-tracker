import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:3000', 'localhost:3000'],
      methods: 'GET,PATCH,POST,DELETE',
    },
  });
  await app.listen(3001);
}
bootstrap();
