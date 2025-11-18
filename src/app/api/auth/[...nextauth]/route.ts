import NextAuth, { NextAuthOptions } from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';

declare module 'next-auth' {
  interface Session {
    user: {
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    email?: string | null;
    name?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.NEXT_KAKAO_CLIENT_ID || '',
      clientSecret: process.env.NEXT_KAKAO_CLIENT_SECRET || '',
    }),
  ],

  secret: process.env.NEXT_AUTH_SECRET,

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        const kakaoProfile = profile as any;

        token.email = kakaoProfile.kakao_account?.email ?? null;
        token.name = kakaoProfile.kakao_account?.profile?.nickname ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
