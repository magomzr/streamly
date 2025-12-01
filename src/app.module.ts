import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { StepsModule } from './modules/steps.module';
import { EngineModule } from './modules/engine.module';

@Module({
  imports: [StepsModule, EngineModule],
  controllers: [AppController],
})
export class AppModule {}
