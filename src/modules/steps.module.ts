import { Module, OnModuleInit } from '@nestjs/common';
import { HttpClientStep } from '../steps/http-client/http-client.service';
import { SendSmsStep } from '../steps/send-sms/send-sms.service';
import { EngineService } from '../engine/engine.service';
import { EngineModule } from './engine.module';
import { JsonMinifierStep } from '../steps/json-minifer/json-minifier.service';
import { DelayStep } from '../steps/delay/delay.service';
import { TransformDataStep } from '../steps/transform-data/transform-data.service';
import { WebhookStep } from '../steps/webhook/webhook.service';

@Module({
  imports: [EngineModule],
  providers: [
    HttpClientStep,
    SendSmsStep,
    JsonMinifierStep,
    DelayStep,
    TransformDataStep,
    WebhookStep,
  ],
  exports: [
    HttpClientStep,
    SendSmsStep,
    JsonMinifierStep,
    DelayStep,
    TransformDataStep,
    WebhookStep,
  ],
})
export class StepsModule implements OnModuleInit {
  constructor(private readonly engineService: EngineService) {}

  onModuleInit() {
    this.engineService.registerStep(HttpClientStep);
    this.engineService.registerStep(SendSmsStep);
    this.engineService.registerStep(JsonMinifierStep);
    this.engineService.registerStep(DelayStep);
    this.engineService.registerStep(TransformDataStep);
    this.engineService.registerStep(WebhookStep);
  }
}
