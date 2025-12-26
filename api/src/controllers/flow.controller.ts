import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { FlowService } from '../services/flow.service';
import { ExecutionService } from '../services/execution.service';
import { SchedulerService } from '../services/scheduler.service';
import { EngineService } from '../engine/engine.service';
import type { IFlow } from '@streamly/shared';

@Controller('flows')
export class FlowController {
  constructor(
    private readonly flowService: FlowService,
    private readonly executionService: ExecutionService,
    private readonly engineService: EngineService,
    private readonly schedulerService: SchedulerService,
  ) {}

  @Post()
  async create(@Body() body: { flow: IFlow }) {
    return this.flowService.create(body.flow);
  }

  @Get()
  async findAll() {
    return this.flowService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.flowService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: { flow: IFlow }) {
    const updated = await this.flowService.update(id, body.flow);

    // Update scheduler if trigger changed
    if (
      updated.triggerType === 'cron' &&
      updated.enabled &&
      updated.cronExpression
    ) {
      this.schedulerService.scheduleFlow(updated.id, updated.cronExpression);
    } else {
      this.schedulerService.unscheduleFlow(updated.id);
    }

    return updated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.flowService.delete(id);
    return { deleted: true };
  }

  @Post(':id/execute')
  async execute(
    @Param('id') id: string,
    @Body() body: { vars?: Record<string, any> },
  ) {
    const flow = await this.flowService.findOne(id);
    if (!flow) throw new Error('Flow not found');

    const context = await this.engineService.runFlow(
      flow.data,
      body.vars || {},
    );
    await this.executionService.create(id, context);

    return context;
  }

  @Get(':id/executions')
  async getExecutions(@Param('id') id: string) {
    return this.executionService.findByFlowId(id);
  }

  @Patch(':id/trigger')
  async updateTrigger(
    @Param('id') id: string,
    @Body() body: { type: string; cronExpression?: string; enabled?: boolean },
  ) {
    const updated = await this.flowService.updateTrigger(
      id,
      body.type,
      body.cronExpression,
      body.enabled,
    );

    if (
      updated.triggerType === 'cron' &&
      updated.enabled &&
      updated.cronExpression
    ) {
      this.schedulerService.scheduleFlow(updated.id, updated.cronExpression);
    } else {
      this.schedulerService.unscheduleFlow(updated.id);
    }

    return updated;
  }

  @Get('scheduled/list')
  async getScheduledFlows() {
    return this.flowService.findScheduled();
  }

  async enableFlow(@Param('id') id: string) {
    const flow = await this.flowService.findOne(id);
    if (!flow) throw new Error('Flow not found');

    const updated = await this.flowService.updateTrigger(
      id,
      flow.triggerType,
      flow.cronExpression || undefined,
      true,
    );

    if (updated.triggerType === 'cron' && updated.cronExpression) {
      this.schedulerService.scheduleFlow(updated.id, updated.cronExpression);
    }

    return updated;
  }

  @Post(':id/disable')
  async disableFlow(@Param('id') id: string) {
    const flow = await this.flowService.findOne(id);
    if (!flow) throw new Error('Flow not found');

    const updated = await this.flowService.updateTrigger(
      id,
      flow.triggerType,
      flow.cronExpression || undefined,
      false,
    );

    this.schedulerService.unscheduleFlow(updated.id);

    return updated;
  }
}
