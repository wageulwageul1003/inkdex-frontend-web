import { z } from 'zod';

export const IMypasswordValidSchema = z.object({
  password: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
});

export type TMyPasswordValidSchema = z.infer<typeof IMypasswordValidSchema>;
