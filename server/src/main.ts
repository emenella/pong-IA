import { NestFactory } from '@nestjs/core';
import { GameModule } from './gameserver.module'

async function bootstrap() {
  const app = await NestFactory.create(GameModule);
  await app.listen(3000);
}
bootstrap();
