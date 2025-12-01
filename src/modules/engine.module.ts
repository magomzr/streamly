import { Module } from '@nestjs/common';
import { EngineService } from 'src/engine/engine.service';

@Module({
  providers: [EngineService],
  exports: [EngineService],
})
export class EngineModule {}
