import { z } from 'zod';

export const registerStep1Schema = z.object({
  uuid: z.string(),
  content: z.string().nonempty({ message: '댓글을 입력해 주세요.' }),
});

export type TRegisterStep1Schema = z.infer<typeof registerStep1Schema>;
