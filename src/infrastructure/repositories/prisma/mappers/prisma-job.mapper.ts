import { Job as PrismaJob, User as PrismaUser, Prisma } from '@prisma/client';

import { Job, JobPayload } from '#/domain/entities/job';

type PrismaJobWithUser = PrismaJob & {
    user?: PrismaUser;
};

export class PrismaJobMapper {
    static toDomain(data: PrismaJobWithUser): Job {
        return new Job({
            id: data.id,
            originalFileName: data.originalFileName,
            originalVideoKey: data.originalVideoKey,
            status: data.status,
            user: data.user,
        } as JobPayload);
    }

    static toCreate(data: Job): Prisma.JobCreateInput {
        return {
            originalFileName: data.originalFileName,
            originalVideoKey: data.originalVideoKey,
            user: {
                connect: { id: data.userId },
            },
        };
    }
}
