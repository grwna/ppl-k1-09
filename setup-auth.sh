#!/bin/bash

# 1. Install dependensi yang diperlukan
echo "Installing dependencies..."
npm install dotenv bcryptjs
npm install -D @types/bcryptjs

# 2. Perbaiki prisma/schema.prisma (SB-1-07)
# Menghapus baris url dan memastikan skema User tersedia
cat << EOF > prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum Role {
  ADMIN
  DONATUR
  PEMINJAM
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  password      String?
  image         String?
  role          Role      @default(DONATUR)
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
EOF

# 3. Perbaiki prisma.config.ts agar mendukung .env
cat << EOF > prisma.config.ts
import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
EOF

# 4. Inisialisasi Prisma Client (Prisma 7 Style)
cat << EOF > src/lib/prisma.ts
import { PrismaClient } from '../generated/prisma';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasource: {
      url: process.env.DATABASE_URL,
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
EOF

# 5. Jalankan Sinkronisasi Database
echo "Generating Prisma Client and Syncing Database..."
npx prisma generate
npx prisma db push

echo "------------------------------------------------"
echo "Setup Selesai! Silakan jalankan 'npm run dev'"
echo "Tugas SB-1-07 (Auth Schema) & SB-1-08 (Library) Siap."
echo "------------------------------------------------"