-- Create database (run this separately if needed)
-- CREATE DATABASE casequeue;

-- Connect to database
\c casequeue;

-- Create tables based on Prisma schema
CREATE TABLE IF NOT EXISTS "User" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "name" TEXT,
  "password" TEXT,
  "companyName" TEXT,
  "phone" TEXT,
  "whatsAppNumber" TEXT,
  "ghlSettings" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Account" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Session" (
  "id" SERIAL PRIMARY KEY,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" INTEGER NOT NULL,
  "expires" TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY ("identifier", "token")
);

CREATE TABLE IF NOT EXISTS "Subscription" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "stripeCustomerId" TEXT,
  "stripeSubscriptionId" TEXT,
  "stripePriceId" TEXT,
  "stripeCurrentPeriodEnd" TIMESTAMP WITH TIME ZONE,
  "plan" TEXT NOT NULL DEFAULT 'free',
  "status" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create unique index on Account
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- Create index on Session userId
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");

-- Create index on Subscription userId
CREATE INDEX IF NOT EXISTS "Subscription_userId_idx" ON "Subscription"("userId");

-- Instructions:
-- 1. Open pgAdmin or your PostgreSQL client
-- 2. Connect to your PostgreSQL server
-- 3. Create a new database named 'casequeue' if it doesn't exist
-- 4. Run this script to create the necessary tables 