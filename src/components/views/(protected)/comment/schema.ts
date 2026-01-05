import { z } from 'zod';

export const commentSchema = z.object({
  publicId: z.string(),
  commentId: z.string().optional(),
  content: z.string().min(1, { message: '댓글을 입력해 주세요.' }),
});

export type TCommentSchema = z.infer<typeof commentSchema>;
