import { inject, injectable } from 'inversify';

import { User } from '#/domain/entities/user';
import { ConflictError } from '#/domain/errors';
import { IUserRepository } from '#/domain/repositories/user.repository';
import { IHashService } from '#/domain/services/hash.service';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { RegisterRequest } from '#/interfaces/http/schemas/auth/auth-request.schema';

@injectable()
export class Register {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.HashService) private readonly hashService: IHashService,
        @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository,
    ) {}

    async execute(request: RegisterRequest): Promise<User> {
        this.logger.info('Registering new user', { email: request.email });

        const existingUser = await this.userRepository.findByEmail(request.email);

        if (existingUser) {
            this.logger.warn('User already exists', { email: request.email });
            throw new ConflictError('User already exists');
        }

        const passwordHash = await this.hashService.hash(request.password);
        const user = new User({
            email: request.email,
            password: passwordHash,
        });

        const registeredUser = await this.userRepository.create(user);

        this.logger.info('User registered successfully', { userId: registeredUser.id });

        return registeredUser;
    }
}
