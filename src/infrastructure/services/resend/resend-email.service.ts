import { Resend } from 'resend';
import { inject, injectable } from 'inversify';

import { SendEmailDTO } from '#/domain/services/dto/email.dto';
import { IEmailService } from '#/domain/services/email.service';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { env } from '#/infrastructure/config/env';

@injectable()
export class ResendEmailService implements IEmailService {
    private resend: Resend;
    private fromEmail: string;

    constructor(@inject(TYPES.Logger) private readonly logger: ILogger) {
        this.resend = new Resend(env.RESEND_API_KEY);
        this.fromEmail = env.EMAIL_FROM;
    }

    async send(request: SendEmailDTO): Promise<void> {
        this.logger.info('Sending email via Resend', { to: request.to, subject: request.subject });

        try {
            const { data, error } = await this.resend.emails.send({
                from: this.fromEmail,
                to: request.to,
                subject: request.subject,
                text: request.body,
                html: request.html,
            });

            if (error) {
                throw new Error(error.message);
            }

            this.logger.info('Email sent successfully', { to: request.to, id: data?.id });
        } catch (error) {
            this.logger.error('Failed to send email', error as Error, { to: request.to });
            throw error;
        }
    }
}
