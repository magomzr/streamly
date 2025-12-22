import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TestController } from './controllers/test.controller';
import { StepsModule } from './modules/steps.module';
import { EngineModule } from './modules/engine.module';
import { FlowModule } from './modules/flow.module';

@Module({
  imports: [StepsModule, EngineModule, FlowModule],
  controllers: [AppController, TestController],
})
export class AppModule {}
