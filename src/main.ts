import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { EngineService } from './engine/engine.service';
import { HttpClientStep } from './steps/http-client/http-client.service';
import { SendSmsStep } from './steps/send-sms/send-sms.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.get(EngineService).registerStep(HttpClientStep);
  app.get(EngineService).registerStep(SendSmsStep);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
