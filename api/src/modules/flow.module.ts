import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FlowController } from '../controllers/flow.controller';
import { FlowService } from '../services/flow.service';
import { ExecutionService } from '../services/execution.service';
import { SchedulerService } from '../services/scheduler.service';
import { EngineModule } from './engine.module';

@Module({
  imports: [EngineModule, ScheduleModule.forRoot()],
  controllers: [FlowController],
  providers: [FlowService, ExecutionService, SchedulerService],
})
export class FlowModule {}
