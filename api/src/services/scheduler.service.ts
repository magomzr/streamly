import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import { FlowService } from './flow.service';
import { ExecutionService } from './execution.service';
import { EngineService } from '../engine/engine.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);
  private readonly scheduledJobs = new Map<string, cron.ScheduledTask>();

  constructor(
    private readonly flowService: FlowService,
    private readonly executionService: ExecutionService,
    private readonly engineService: EngineService,
  ) {}

  async onModuleInit() {
    await this.loadScheduledFlows();
  }

  private async loadScheduledFlows() {
    const flows = await this.flowService.findAll();
    const cronFlows = flows.filter(
      (f) => f.triggerType === 'cron' && f.enabled && f.cronExpression,
    );

    this.logger.log(`Loading ${cronFlows.length} scheduled flows`);

    for (const flow of cronFlows) {
      if (flow.cronExpression) {
        this.scheduleFlow(flow.id, flow.cronExpression);
      }
    }
  }

  scheduleFlow(flowId: string, cronExpression: string) {
    if (this.scheduledJobs.has(flowId)) {
      this.unscheduleFlow(flowId);
    }

    if (!cron.validate(cronExpression)) {
      this.logger.error(
        `Invalid cron expression for flow ${flowId}: ${cronExpression}`,
      );
      return;
    }

    const task = cron.schedule(cronExpression, async () => {
      this.logger.log(`Executing scheduled flow: ${flowId}`);
      try {
        const flow = await this.flowService.findOne(flowId);
        if (!flow?.enabled) {
          this.logger.warn(
            `Flow ${flowId} not found or disabled, unscheduling`,
          );
          this.unscheduleFlow(flowId);
          return;
        }

        const context = await this.engineService.runFlow(flow.data, {});
        await this.executionService.create(flowId, context, 'cron');
        this.logger.log(`Flow ${flowId} executed successfully`);
      } catch (error) {
        this.logger.error(`Error executing flow ${flowId}:`, error);
      }
    });

    this.scheduledJobs.set(flowId, task);
    this.logger.log(`Scheduled flow ${flowId} with cron: ${cronExpression}`);
  }

  unscheduleFlow(flowId: string) {
    const task = this.scheduledJobs.get(flowId);
    if (task) {
      task.stop();
      this.scheduledJobs.delete(flowId);
      this.logger.log(`Unscheduled flow: ${flowId}`);
    }
  }

  getScheduledFlows() {
    return Array.from(this.scheduledJobs.keys());
  }
}
