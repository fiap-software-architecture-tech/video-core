import { Job as PrismaJob, Prisma } from '@prisma/client';

import { Job, JobPayload } from '#/domain/entities/job';

export class PrismaJobMapper {
    static toDomain(data: PrismaJob): Job {
        return new Job({
            id: data.id,
            originalFileName: data.originalFileName,
            originalVideoKey: data.originalVideoKey,
            status: data.status,
        } as JobPayload);
    }

    static toCreate(data: Job): Prisma.JobCreateInput {
        return {
            originalFileName: data.originalFileName,
            originalVideoKey: data.originalVideoKey,
        };
    }
}
