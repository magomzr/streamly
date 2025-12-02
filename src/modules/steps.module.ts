import { Module, OnModuleInit } from '@nestjs/common';
import { HttpClientStep } from '../steps/http-client/http-client.service';
import { SendSmsStep } from '../steps/send-sms/send-sms.service';
import { RouterStep } from '../steps/router/router.service';
import { EngineService } from '../engine/engine.service';
import { EngineModule } from './engine.module';

@Module({
  imports: [EngineModule],
  providers: [HttpClientStep, SendSmsStep, RouterStep],
  exports: [HttpClientStep, SendSmsStep, RouterStep],
})
export class StepsModule implements OnModuleInit {
  constructor(private readonly engineService: EngineService) {}

  onModuleInit() {
    this.engineService.registerStep(HttpClientStep);
    this.engineService.registerStep(SendSmsStep);
    this.engineService.registerStep(RouterStep);
  }
}
