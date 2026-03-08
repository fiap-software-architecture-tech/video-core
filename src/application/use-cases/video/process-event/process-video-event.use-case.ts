export interface ProcessVideoEventRequest {
    jobId: string;
    eventType: string;
    zipKey?: string;
    frameCount?: number;
    error?: string;
}

export interface IProcessVideoEventUseCase {
    execute(request: ProcessVideoEventRequest): Promise<void>;
}
