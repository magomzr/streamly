import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TestController } from './controllers/test.controller';
import { SecretsController } from './controllers/secrets.controller';
import { StepsModule } from './modules/steps.module';
import { EngineModule } from './modules/engine.module';
import { FlowModule } from './modules/flow.module';
import { SecretsService } from './services/secrets.service';

@Module({
  imports: [StepsModule, EngineModule, FlowModule],
  controllers: [AppController, TestController, SecretsController],
  providers: [SecretsService],
  exports: [SecretsService],
})
export class AppModule {}
