import { Job as PrismaJob, User as PrismaUser, Prisma } from '@prisma/client';

import { Job, JobPayload } from '#/domain/entities/job';

type PrismaJobWithUser = PrismaJob & {
    user?: PrismaUser;
};

export class PrismaJobMapper {
    static toDomain(data: PrismaJobWithUser): Job {
        return new Job({
            id: data.id,
            userId: data.userId,
            originalFileName: data.originalFileName,
            originalVideoKey: data.originalVideoKey,
            status: data.status,
            zipKey: data.zipKey || undefined,
            frameCount: data.frameCount || undefined,
            errorMessage: data.errorMessage || undefined,
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

    static toUpdate(data: Partial<Job>): Prisma.JobUpdateInput {
        return {
            ...(data.status ? { status: data.status as any } : {}),
            ...(data.zipKey ? { zipKey: data.zipKey } : {}),
            ...(data.frameCount !== undefined ? { frameCount: data.frameCount } : {}),
            ...(data.errorMessage !== undefined ? { errorMessage: data.errorMessage } : {}),
        };
    }
}
