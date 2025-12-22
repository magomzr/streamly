import { Module, OnModuleInit } from '@nestjs/common';
import { EngineService } from '../engine/engine.service';
import { EngineModule } from './engine.module';
import {
  ConditionalStep,
  HttpClientStep,
  WebhookStep,
  SendSmsStep,
  DelayStep,
  FilterArrayStep,
  SortArrayStep,
  TransformDataStep,
  JsonMinifierStep,
  Base64EncodeStep,
  Base64DecodeStep,
  StringFormatStep,
} from '../steps';

@Module({
  imports: [EngineModule],
  providers: [
    ConditionalStep,
    HttpClientStep,
    SendSmsStep,
    JsonMinifierStep,
    DelayStep,
    TransformDataStep,
    WebhookStep,
    FilterArrayStep,
    SortArrayStep,
    StringFormatStep,
    Base64EncodeStep,
    Base64DecodeStep,
  ],
  exports: [
    ConditionalStep,
    HttpClientStep,
    SendSmsStep,
    JsonMinifierStep,
    DelayStep,
    TransformDataStep,
    WebhookStep,
    FilterArrayStep,
    SortArrayStep,
    StringFormatStep,
    Base64EncodeStep,
    Base64DecodeStep,
  ],
})
export class StepsModule implements OnModuleInit {
  constructor(private readonly engineService: EngineService) {}

  onModuleInit() {
    this.engineService.registerStep(ConditionalStep);
    this.engineService.registerStep(HttpClientStep);
    this.engineService.registerStep(SendSmsStep);
    this.engineService.registerStep(JsonMinifierStep);
    this.engineService.registerStep(DelayStep);
    this.engineService.registerStep(TransformDataStep);
    this.engineService.registerStep(WebhookStep);
    this.engineService.registerStep(FilterArrayStep);
    this.engineService.registerStep(SortArrayStep);
    this.engineService.registerStep(StringFormatStep);
    this.engineService.registerStep(Base64EncodeStep);
    this.engineService.registerStep(Base64DecodeStep);
  }
}
