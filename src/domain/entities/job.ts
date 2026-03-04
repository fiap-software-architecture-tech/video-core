import { User } from '#/domain/entities/user';

export type JobPayload = {
    id?: string;
    userId: string;
    originalFileName: string;
    originalVideoKey: string;
    status?: string;
    zipKey?: string;
    frameCount?: number;
    errorMessage?: string;
    user?: User;
};

export class Job {
    public readonly id: string;
    public userId: string;
    public originalFileName: string;
    public originalVideoKey: string;
    public status?: string;
    public zipKey?: string;
    public frameCount?: number;
    public errorMessage?: string;
    public user?: User;

    constructor(payload: JobPayload) {
        this.id = payload.id || crypto.randomUUID();
        this.userId = payload.userId;
        this.originalFileName = payload.originalFileName;
        this.originalVideoKey = payload.originalVideoKey;
        this.status = payload.status;
        this.zipKey = payload.zipKey;
        this.frameCount = payload.frameCount;
        this.errorMessage = payload.errorMessage;
        this.user = payload.user;
    }
}
