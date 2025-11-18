import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider, { KakaoProfile } from 'next-auth/providers/kakao';

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

interface ExtendedKakaoProfile extends KakaoProfile {
  kakao_account?: {
    email?: string;
    name?: string;
    profile?: {
      nickname?: string;
    };
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.NEXT_KAKAO_CLIENT_ID || '',
      clientSecret: process.env.NEXT_KAKAO_CLIENT_SECRET || '',
    }),

    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET || '',
    }),
  ],

  secret: process.env.NEXT_AUTH_SECRET,

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, profile, account }) {
      if (account?.provider === 'kakao' && profile) {
        const p = profile as ExtendedKakaoProfile;

        token.email = p.kakao_account?.email ?? null;
        token.name = p.kakao_account?.name ?? null;
      }

      if (account?.provider === 'google' && profile) {
        token.email = profile.email ?? null;
        token.name = profile.name ?? null;
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
