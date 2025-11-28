import { Injectable } from '@nestjs/common';
import { IStreamlyStep } from 'src/types/step';

@Injectable()
export class HttpClientStepService implements IStreamlyStep {
  name = 'httpClient';

  async run(context: any): Promise<any> {
    // Simulate an HTTP request using context data
    console.log(
      '[HttpClientStepService] making fake request with:',
      context.query,
    );

    const fakeResponse = {
      status: 200,
      data: {
        greeting: 'Hello from HttpClientStepService!',
        timestamp: Date.now(),
        info: context.query,
      },
    };

    return fakeResponse;
  }
}
