import { Controller, Get } from '@nestjs/common';
import { EngineService } from '../engine/engine.service';
import {
  sampleFlow,
  failingFlow,
  complexFlow,
  vars,
} from '../fixtures/sample-flows';

@Controller('test')
export class TestController {
  constructor(private readonly engineService: EngineService) {}

  @Get('simple')
  testSimple(): any {
    return this.engineService.runFlow(sampleFlow, vars);
  }

  @Get('fail')
  testFailure(): any {
    return this.engineService.runFlow(failingFlow, vars);
  }

  @Get('complex')
  testComplex(): any {
    return this.engineService.runFlow(complexFlow, vars);
  }
}
