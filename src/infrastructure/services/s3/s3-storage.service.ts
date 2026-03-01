import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { inject, injectable } from 'inversify';

import { StorageDTO } from '#/domain/services/dto/storage.dto';
import { ILogger } from '#/domain/services/logger.service';
import { StorageService } from '#/domain/services/storage.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { env } from '#/infrastructure/config/env';

@injectable()
export class S3StorageService implements StorageService {
    private s3Client: S3Client;

    constructor(@inject(TYPES.Logger) private readonly logger: ILogger) {
        this.s3Client = new S3Client({
            region: env.AWS_REGION,
            endpoint: env.AWS_ENDPOINT,
            forcePathStyle: env.NODE_ENV === 'dev',
        });
    }

    async upload(request: StorageDTO): Promise<void> {
        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: env.AWS_BUCKET_NAME,
                    Key: request.key,
                    Body: request.body,
                    ContentType: request.contentType,
                }),
            );
        } catch (error) {
            console.log(error);
        }
    }
}
