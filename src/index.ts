import 'reflect-metadata';
import 'dotenv/config';
import { startServer } from '#/infrastructure/server/server';

startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
