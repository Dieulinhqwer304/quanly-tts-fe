import { coerce, object, z } from 'zod';

// Định nghĩa schema validation với zod
export const getMutationAccount = object({
    fullName: coerce.string(),
    email: coerce.string(),
    password: coerce.string().optional(),
    phone: coerce.string().optional(),
    avatar: coerce.string().optional(),
    role_id: coerce.string(),
    status: coerce.string()
});

export type AccountSchema = z.infer<typeof getMutationAccount>;
