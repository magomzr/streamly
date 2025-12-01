import { Module } from '@nestjs/common';
import { HttpClientStep } from 'src/steps/http-client/http-client.service';
import { SendSmsStep } from 'src/steps/send-sms/send-sms.service';

@Module({
  providers: [HttpClientStep, SendSmsStep],
  exports: [HttpClientStep, SendSmsStep],
})
export class StepsModule {}
