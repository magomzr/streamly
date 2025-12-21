import { Module } from '@nestjs/common';
import { EngineService } from '../engine/engine.service';
import { StepRegistry } from '../registry/stepRegistry';

@Module({
  providers: [StepRegistry, EngineService],
  exports: [EngineService],
})
export class EngineModule {}
