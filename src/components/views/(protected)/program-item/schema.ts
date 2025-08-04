import { z } from 'zod';

export const refundSchema = z.object({
  uuid: z.string(),
  constBankCode: z.string(), // 은행 코드
  accountNumber: z.string(), // 은행 계좌번호
  refundDepositor: z.string(), // 환불 예금주
});

export type TRefundSchema = z.infer<typeof refundSchema>;
