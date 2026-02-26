export const TYPES = {
    // Database
    PrismaClient: Symbol.for('PrismaClient'),

    // Repositories
    UserRepository: Symbol.for('UserRepository'),

    // UseCases
    Register: Symbol.for('Register'),

    // Services
    HashService: Symbol.for('HashService'),
    Logger: Symbol.for('Logger'),
};
