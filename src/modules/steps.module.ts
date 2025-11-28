import { Module } from '@nestjs/common';
import { HttpClientStepService } from 'src/steps/http-client.step/http-client.step.service';
import { SendSmsStepService } from 'src/steps/send-sms.step/send-sms.step.service';

@Module({
  providers: [HttpClientStepService, SendSmsStepService],
})
export class StepsModule {}
