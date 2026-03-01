export type JobPayload = {
    id?: string;
    originalFileName: string;
    originalVideoKey: string;
    status?: string;
    zipKey?: string;
    frameCount?: string;
    errorMessage?: string;
};

export class Job {
    public readonly id: string;
    public originalFileName: string;
    public originalVideoKey: string;
    public status?: string;
    public zipKey?: string;
    public frameCount?: string;
    public errorMessage?: string;

    constructor(payload: JobPayload) {
        this.id = payload.id || crypto.randomUUID();
        this.originalFileName = payload.originalFileName;
        this.originalVideoKey = payload.originalVideoKey;
        this.status = payload.status;
        this.zipKey = payload.zipKey;
        this.frameCount = payload.frameCount;
        this.errorMessage = payload.errorMessage;
    }
}
