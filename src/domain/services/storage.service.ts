import { StorageDTO } from '#/domain/services/dto/storage.dto';

export interface StorageService {
    upload(request: StorageDTO): Promise<void>;
}
