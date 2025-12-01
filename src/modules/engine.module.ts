import { Module } from '@nestjs/common';
import { EngineService } from 'src/engine/engine.service';
import { StepRegistry } from 'src/registry/stepRegistry';

@Module({
  providers: [StepRegistry, EngineService],
  exports: [EngineService],
})
export class EngineModule {}
