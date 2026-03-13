import { FastifyInstance } from 'fastify';

import { authRoute } from '#/interfaces/http/routes/auth.route';
import { videoRoute } from '#/interfaces/http/routes/video.route';

export function registerRoutes(app: FastifyInstance) {
    app.register(authRoute, { prefix: '/' });
    app.register(videoRoute, { prefix: '/video' });
}
