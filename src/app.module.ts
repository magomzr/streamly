import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StepsModule } from './modules/steps.module';
import { EngineModule } from './modules/engine.module';

@Module({
  imports: [StepsModule, EngineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
