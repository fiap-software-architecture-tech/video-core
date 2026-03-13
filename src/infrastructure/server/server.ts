import { container } from '#/infrastructure/config/di/container';
import { env } from '#/infrastructure/config/env';
import { VideoProcessedQueueConsumer } from '#/infrastructure/queue/video-processed-consumer';
import { buildApp } from '#/infrastructure/server/app';

export async function startServer() {
    const app = buildApp(container);

    try {
        await app.listen({ port: env.PORT, host: '0.0.0.0' });
        console.log(`HTTP server is running on port ${env.PORT}`);

        // Start SQS consumer for processed videos
        const consumer = new VideoProcessedQueueConsumer();
        consumer.start().catch(error => {
            console.error('Error starting queue consumer:', error);
        });

        // Handle graceful shutdown
        process.on('SIGTERM', () => {
            consumer.stop();
            app.close().then(() => process.exit(0));
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
