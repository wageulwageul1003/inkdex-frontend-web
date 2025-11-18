import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.NEXT_KAKAO_CLIENT_ID || '',
      clientSecret: process.env.NEXT_KAKAO_CLIENT_SECRET || '',
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
});

export { handler as GET, handler as POST };
