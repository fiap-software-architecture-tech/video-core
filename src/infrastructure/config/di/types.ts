export const TYPES = {
    // Database
    PrismaClient: Symbol.for('PrismaClient'),

    // Repositories
    UserRepository: Symbol.for('UserRepository'),
    JobRepository: Symbol.for('JobRepository'),

    // UseCases
    RegisterUseCase: Symbol.for('RegisterUseCase'),
    LoginUseCase: Symbol.for('LoginUseCase'),
    VideoUploadUseCase: Symbol.for('VideoUploadUseCase'),
    VideoListUseCase: Symbol.for('VideoListUseCase'),
    ProcessVideoEventUseCase: Symbol.for('ProcessVideoEventUseCase'),

    // Controllers
    AuthController: Symbol.for('AuthController'),
    VideoController: Symbol.for('VideoController'),

    // Services
    HashService: Symbol.for('HashService'),
    TokenService: Symbol.for('TokenService'),
    StorageService: Symbol.for('StorageService'),
    QueueProviderService: Symbol.for('QueueProviderService'),
    Logger: Symbol.for('Logger'),
};
