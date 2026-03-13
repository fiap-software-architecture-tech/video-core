import { inject, injectable } from 'inversify';

import { IProcessVideoEventUseCase, ProcessVideoEventRequest } from '#/application/use-cases/video/process-event/process-video-event.use-case';
import { EventType } from '#/domain/enum/event-type';
import { IJobRepository } from '#/domain/repositories/job.repository';
import { IEmailService } from '#/domain/services/email.service';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';

@injectable()
export class ProcessVideoEvent implements IProcessVideoEventUseCase {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.JobRepository) private readonly jobRepository: IJobRepository,
        @inject(TYPES.EmailService) private readonly emailService: IEmailService,
    ) {}

    async execute(request: ProcessVideoEventRequest): Promise<void> {
        this.logger.info('Processing video event', { request });

        try {
            if (request.eventType === EventType.DONE) {
                await this.jobRepository.update(request.jobId, {
                    status: 'DONE',
                    zipKey: request.zipKey,
                    frameCount: request.frameCount,
                });
                this.logger.info('Job marked as DONE', { jobId: request.jobId });
            } else if (request.eventType === EventType.ERROR) {
                // Buscar job com informações do usuário
                const job = await this.jobRepository.findById(request.jobId);

                if (!job) {
                    this.logger.warn('Job not found for error notification', { jobId: request.jobId });
                    return;
                }

                // Atualizar status para ERROR
                await this.jobRepository.update(request.jobId, {
                    status: 'ERROR',
                    errorMessage: request.error,
                });
                this.logger.info('Job marked as ERROR', { jobId: request.jobId });

                // Enviar email de notificação se tiver usuário
                if (job.user?.email) {
                    try {
                        await this.emailService.send({
                            to: job.user.email,
                            subject: '❌ Falha no Processamento de Vídeo',
                            body: `Olá,\n\nInfelizmente ocorreu uma falha ao processar seu vídeo "${job.originalFileName}".\n\nDetalhes do erro:\n${request.error}\n\nPor favor, tente fazer o upload novamente.\n\nAtenciosamente,\nEquipe Video Processing`,
                            html: `
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <meta charset="UTF-8">
                                    <style>
                                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                        .header { background-color: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                                        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
                                        .error-box { background-color: #fff3cd; border-left: 4px solid #ff6b6b; padding: 15px; margin: 15px 0; }
                                        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                                    </style>
                                </head>
                                <body>
                                    <div class="container">
                                        <div class="header">
                                            <h1>❌ Falha no Processamento</h1>
                                        </div>
                                        <div class="content">
                                            <p>Olá,</p>
                                            <p>Infelizmente ocorreu uma falha ao processar seu vídeo:</p>
                                            <p><strong>📹 Arquivo:</strong> ${job.originalFileName}</p>
                                            <div class="error-box">
                                                <strong>🔍 Detalhes do erro:</strong><br>
                                                ${request.error}
                                            </div>
                                            <p>Por favor, tente fazer o upload novamente.</p>
                                            <p>Se o problema persistir, entre em contato com o suporte.</p>
                                        </div>
                                        <div class="footer">
                                            <p>© 2026 Video Processing Platform | FIAP</p>
                                        </div>
                                    </div>
                                </body>
                                </html>
                            `,
                        });
                        this.logger.info('Error notification email sent', {
                            jobId: request.jobId,
                            email: job.user.email,
                        });
                    } catch (emailError) {
                        this.logger.error('Failed to send error notification email', emailError as Error, {
                            jobId: request.jobId,
                            email: job.user.email,
                        });
                        // Não falhar o processamento se o email não enviar
                    }
                }
            }
        } catch (error) {
            this.logger.error('Failed to process video event', error as Error, { request });
            throw error;
        }
    }
}
