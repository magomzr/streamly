import { Module } from '@nestjs/common';
import { FlowController } from '../controllers/flow.controller';
import { FlowService } from '../services/flow.service';
import { ExecutionService } from '../services/execution.service';
import { EngineModule } from './engine.module';

@Module({
  imports: [EngineModule],
  controllers: [FlowController],
  providers: [FlowService, ExecutionService],
})
export class FlowModule {}
