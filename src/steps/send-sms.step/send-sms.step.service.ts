import { Injectable } from '@nestjs/common';
import { IStreamlyStep } from 'src/types/step';

@Injectable()
export class SendSmsStepService implements IStreamlyStep {
  name = 'sendSms';

  async run(context: any): Promise<any> {
    // Simulate sending an SMS using context data
    console.log('[SendSmsStepService] sending fake SMS with:', context.message);

    const fakeResponse = {
      status: 'sent',
      timestamp: Date.now(),
      message: context.message,
    };

    return fakeResponse;
  }
}
