import { container } from '#/infrastructure/config/di/container';
import { env } from '#/infrastructure/config/env';
import { buildApp } from '#/infrastructure/server/app';

export async function startServer() {
    const app = buildApp(container);

    try {
        await app.listen({ port: env.PORT, host: '0.0.0.0' });
        console.log(`HTTP server is running on port ${env.PORT}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
