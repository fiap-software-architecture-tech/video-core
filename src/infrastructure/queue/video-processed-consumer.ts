import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import { IProcessVideoEventUseCase } from '#/application/use-cases/video/process-event/process-video-event.use-case';
import { container } from '#/infrastructure/config/di/container';
import { TYPES } from '#/infrastructure/config/di/types';
import { env } from '#/infrastructure/config/env';
import { ILogger } from '#/domain/services/logger.service';

export class VideoProcessedQueueConsumer {
    private sqsClient: SQSClient;
    private logger: ILogger;
    private useCase: IProcessVideoEventUseCase;
    private isRunning = false;

    constructor() {
        this.sqsClient = new SQSClient({
            region: env.AWS_REGION,
            ...(env.AWS_ENDPOINT ? { endpoint: env.AWS_ENDPOINT } : {}),
        });
        this.logger = container.get<ILogger>(TYPES.Logger);
        this.useCase = container.get<IProcessVideoEventUseCase>(TYPES.ProcessVideoEventUseCase);
    }

    async start() {
        if (!env.AWS_SQS_PROCESSED_URL) {
            this.logger.info('AWS_SQS_PROCESSED_URL not configured, skipping consumer');
            return;
        }

        this.isRunning = true;
        this.logger.info('Starting video processed queue consumer', {
            queueUrl: env.AWS_SQS_PROCESSED_URL,
        });

        // Polling loop
        while (this.isRunning) {
            try {
                await this.pollMessages();
            } catch (error) {
                this.logger.error('Error in consumer loop', error as Error);
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }

    stop() {
        this.isRunning = false;
        this.logger.info('Stopping video processed queue consumer');
    }

    private async pollMessages() {
        const command = new ReceiveMessageCommand({
            QueueUrl: env.AWS_SQS_PROCESSED_URL,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 20, // Long polling
            VisibilityTimeout: 30,
        });

        const response = await this.sqsClient.send(command);

        if (!response.Messages || response.Messages.length === 0) {
            return;
        }

        this.logger.info('Received messages from queue', {
            count: response.Messages.length,
        });

        await Promise.all(
            response.Messages.map(async message => {
                try {
                    const body = JSON.parse(message.Body!);
                    this.logger.info('Processing message', { body });

                    await this.useCase.execute({
                        jobId: body.jobId,
                        eventType: body.eventType,
                        zipKey: body.zipKey,
                        frameCount: body.frameCount,
                        error: body.error,
                    });

                    // Delete message after successful processing
                    await this.sqsClient.send(
                        new DeleteMessageCommand({
                            QueueUrl: env.AWS_SQS_PROCESSED_URL,
                            ReceiptHandle: message.ReceiptHandle!,
                        }),
                    );

                    this.logger.info('Message processed and deleted', {
                        messageId: message.MessageId,
                    });
                } catch (error) {
                    this.logger.error('Error processing message', error as Error, {
                        messageId: message.MessageId,
                    });
                    // Message will be retried or sent to DLQ
                }
            }),
        );
    }
}
