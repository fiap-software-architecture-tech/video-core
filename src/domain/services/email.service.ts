import { SendEmailDTO } from '#/domain/services/dto/email.dto';

export interface IEmailService {
    send(request: SendEmailDTO): Promise<void>;
}
