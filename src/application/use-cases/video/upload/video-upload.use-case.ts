import { MultipartFile } from '@fastify/multipart';

export interface IVideoUploadUseCase {
    execute(file: MultipartFile): Promise<any>;
}
