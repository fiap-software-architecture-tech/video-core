import { Container } from 'inversify';

import { TYPES } from '#/infrastructure/config/di/types';
import { AuthController } from '#/interfaces/controller/auth.controller';
import { VideoController } from '#/interfaces/controller/video.controller';

export function bindControllers(container: Container) {
    container.bind<AuthController>(TYPES.AuthController).to(AuthController).inTransientScope();
    container.bind<VideoController>(TYPES.VideoController).to(VideoController).inTransientScope();
}
