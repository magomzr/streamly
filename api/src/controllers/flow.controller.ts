import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { FlowService } from '../services/flow.service';
import { ExecutionService } from '../services/execution.service';
import { EngineService } from '../engine/engine.service';
import type { IFlow } from '@streamly/shared';

@Controller('flows')
export class FlowController {
  constructor(
    private readonly flowService: FlowService,
    private readonly executionService: ExecutionService,
    private readonly engineService: EngineService,
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
    return this.flowService.update(id, body.flow);
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
}
