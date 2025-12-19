import { Body, Controller, Post } from '@nestjs/common';
import { EngineService } from './engine/engine.service';

@Controller()
export class AppController {
  constructor(private readonly engineService: EngineService) {}

  @Post('run')
  runFlow(@Body() body: { flow: any; vars?: any }): any {
    return this.engineService.runFlow(body.flow, body.vars || {});
  }
}
