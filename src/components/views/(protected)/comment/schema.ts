import { z } from 'zod';

export const commentDepth1Schema = z.object({
  postUuid: z.string(),
  content: z.string().min(1, { message: '댓글을 입력해 주세요.' }),
});

export const commentDepth2Schema = z.object({
  postUuid: z.string(),
  parentUuid: z.string(),
  content: z.string().min(1, { message: '댓글을 입력해 주세요.' }),
});

export type TCommentDepth1Schema = z.infer<typeof commentDepth1Schema>;
export type TCommentDepth2Schema = z.infer<typeof commentDepth2Schema>;
