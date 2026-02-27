export const TYPES = {
    // Database
    PrismaClient: Symbol.for('PrismaClient'),

    // Repositories
    UserRepository: Symbol.for('UserRepository'),

    // UseCases
    RegisterUseCase: Symbol.for('RegisterUseCase'),
    LoginUseCase: Symbol.for('LoginUseCase'),

    // Controllers
    AuthController: Symbol.for('AuthController'),

    // Services
    HashService: Symbol.for('HashService'),
    TokenService: Symbol.for('TokenService'),
    Logger: Symbol.for('Logger'),
};
