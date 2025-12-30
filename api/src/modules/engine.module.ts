import { Module } from '@nestjs/common';
import { EngineService } from '../engine/engine.service';
import { StepRegistry } from '../registry/stepRegistry';
import { SecretsService } from '../services/secrets.service';

@Module({
  providers: [StepRegistry, EngineService, SecretsService],
  exports: [EngineService],
})
export class EngineModule {}
