export const TYPES = {
    // Database
    PrismaClient: Symbol.for('PrismaClient'),

    // Repositories
    UserRepository: Symbol.for('UserRepository'),

    // UseCases
    RegisterUseCase: Symbol.for('RegisterUseCase'),

    // Controllers
    AuthController: Symbol.for('AuthController'),

    // Services
    HashService: Symbol.for('HashService'),
    Logger: Symbol.for('Logger'),
};
