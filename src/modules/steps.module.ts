import { Module, OnModuleInit } from '@nestjs/common';
import { HttpClientStep } from 'src/steps/http-client/http-client.service';
import { SendSmsStep } from 'src/steps/send-sms/send-sms.service';
import { EngineService } from 'src/engine/engine.service';
import { EngineModule } from './engine.module';

@Module({
  imports: [EngineModule],
  providers: [HttpClientStep, SendSmsStep],
  exports: [HttpClientStep, SendSmsStep],
})
export class StepsModule implements OnModuleInit {
  constructor(private readonly engineService: EngineService) {}

  onModuleInit() {
    this.engineService.registerStep(HttpClientStep);
    this.engineService.registerStep(SendSmsStep);
  }
}
