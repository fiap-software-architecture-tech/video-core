import z from 'zod';

const ALLOWED_MIME_TYPES = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-matroska'] as const;
const MAX_FILE_SIZE = 500 * 1024 * 1024;

export const videoUploadRequestSchema = z.object({
    fileName: z.string(),
    mimetype: z.string().refine(type => ALLOWED_MIME_TYPES.includes(type as any), {
        message: `Invalid file type. Allowed types are: ${ALLOWED_MIME_TYPES.join(', ')}`,
    }),
    fileSize: z.number().max(MAX_FILE_SIZE, {
        message: `File size exceeds the limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    }),
    stream: z.any(),
});

export type VideoUploadRequest = z.infer<typeof videoUploadRequestSchema>;
