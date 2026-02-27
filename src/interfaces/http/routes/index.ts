import { FastifyInstance } from 'fastify';

import { AuthMiddleware } from '#/interfaces/http/middlewares/auth.middleware';
import { authRoute } from '#/interfaces/http/routes/auth.route';
import { videoRoute } from '#/interfaces/http/routes/video.route';

export function registerRoutes(app: FastifyInstance) {
    const authMiddleware = app.container.get(AuthMiddleware);

    app.register(authRoute, { prefix: '/' });

    app.addHook('onRequest', authMiddleware.handle);

    app.register(
        protectedApp => {
            protectedApp.addHook('onRequest', authMiddleware.handle);
            protectedApp.register(videoRoute);
        },
        { prefix: '/video' },
    );
}
