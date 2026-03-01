import { Container } from 'inversify';

import { Login } from '#/application/use-cases/auth/login/login';
import { ILoginUseCase } from '#/application/use-cases/auth/login/login.use-case';
import { Register } from '#/application/use-cases/auth/register/register';
import { IRegisterUseCase } from '#/application/use-cases/auth/register/register.use-case';
import { VideoList } from '#/application/use-cases/video/list/video-list';
import { IVideoListUseCase } from '#/application/use-cases/video/list/video-list.use-case';
import { VideoUpload } from '#/application/use-cases/video/upload/video-upload';
import { IVideoUploadUseCase } from '#/application/use-cases/video/upload/video-upload.use-case';
import { TYPES } from '#/infrastructure/config/di/types';

export function bindUseCases(container: Container) {
    container.bind<IRegisterUseCase>(TYPES.RegisterUseCase).to(Register).inTransientScope();
    container.bind<ILoginUseCase>(TYPES.LoginUseCase).to(Login).inTransientScope();
    container.bind<IVideoListUseCase>(TYPES.VideoListUseCase).to(VideoList).inTransientScope();
    container.bind<IVideoUploadUseCase>(TYPES.VideoUploadUseCase).to(VideoUpload).inTransientScope();
}
