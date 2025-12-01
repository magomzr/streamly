import { Module } from '@nestjs/common';
import { HttpClientStep } from 'src/steps/http-client/http-client.service';
import { SendSmsStepService } from 'src/steps/send-sms/send-sms.service';

@Module({
  providers: [HttpClientStep, SendSmsStepService],
  exports: [HttpClientStep, SendSmsStepService],
})
export class StepsModule {}
