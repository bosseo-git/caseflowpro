import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'

// Log database connection attempts
console.log("Database URL:", process.env.DATABASE_URL?.substring(0, 25) + "..." || "Not set");

// Optimize Prisma for serverless environment
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
    datasourceUrl: process.env.POSTGRES_PRISMA_URL,
  });
} else {
  // In development, use a more verbose logging
  prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
}

// Test database connection
prisma.$connect()
  .then(() => console.log("Database connection successful"))
  .catch((e) => console.error("Database connection failed:", e));

// This allows NextAuth to work on both production and preview URLs
const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith('https://') || process.env.VERCEL_URL?.startsWith('https://');
const cookiePrefix = useSecureCookies ? '__Secure-' : '';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        }
      }
    })
  ],
  useSecureCookies,
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies
      }
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies
      }
    },
    csrfToken: {
      name: `${useSecureCookies ? '__Host-' : ''}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies
      }
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        // Log sign-in attempt info (without sensitive data)
        console.log("Sign-in attempt:", { 
          provider: account?.provider,
          userId: user?.id,
          userEmail: user?.email
        });
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      try {
        if (user) {
          token.id = user.id
        }
        if (account) {
          token.accessToken = account.access_token
        }
        return token;
      } catch (error) {
        console.error("Error in JWT callback:", error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.id = token.id as string
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    }
  },
  // Enable debug mode to see detailed errors
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  // Add better error handling
  events: {
    async signIn(message) {
      console.log("User signed in successfully:", {
        userId: message.user.id,
        provider: message.account?.provider
      });
    },
    async createUser(message) {
      console.log("New user created:", message.user.id);
    },
    async linkAccount(message) {
      console.log("Account linked:", {
        userId: message.user.id,
        provider: message.account.provider
      });
    },
    async session(message) {
      console.log("Session accessed:", message.session.user.id);
    }
  }
}

export default NextAuth(authOptions) 