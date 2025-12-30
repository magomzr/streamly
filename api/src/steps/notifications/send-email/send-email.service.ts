import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class SendEmailStep implements IStepExecutor {
  static readonly stepType = 'send_email';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { email, appPassword, to, subject, body, html } = settings;

    ctx.logs.push(
      createStepLog('INFO', SendEmailStep.name, `Sending email to ${to}`),
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: appPassword,
      },
    });

    const mailOptions = {
      from: email,
      to,
      subject,
      ...(html ? { html: body } : { text: body }),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      ctx.logs.push(
        createStepLog(
          'INFO',
          SendEmailStep.name,
          `Email sent successfully: ${info.messageId}`,
        ),
      );
      return { messageId: info.messageId, accepted: info.accepted };
    } catch (error) {
      ctx.logs.push(
        createStepLog(
          'ERROR',
          SendEmailStep.name,
          `Failed to send email: ${error.message}`,
        ),
      );
      throw error;
    }
  }
}
