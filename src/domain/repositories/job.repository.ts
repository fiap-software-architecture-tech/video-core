import { Job } from '#/domain/entities/job';

export interface IJobRepository {
    create(job: Job): Promise<Job>;
    list(): Promise<Job[]>;
}
