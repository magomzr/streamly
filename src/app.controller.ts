import { Body, Controller, Post } from '@nestjs/common';
import { EngineService } from './engine/engine.service';
import { IBody, IContext } from './types';

@Controller()
export class AppController {
  constructor(private readonly engineService: EngineService) {}

  @Post('run')
  runFlow(@Body() body: IBody): Promise<IContext> {
    return this.engineService.runFlow(body.flow, body.vars || {});
  }
}
