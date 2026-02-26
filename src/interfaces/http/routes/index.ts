import { FastifyInstance } from 'fastify';

import { authRoute } from '#/interfaces/http/routes/auth.route';

export function registerRoutes(app: FastifyInstance) {
    app.register(authRoute, { prefix: '/' });
}
