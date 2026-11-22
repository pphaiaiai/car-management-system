import { PrismaPg } from '@prisma/adapter-pg';

import { env } from '../config/env.js';
import { PrismaClient } from '../generated/prisma/client.js';

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  // node-postgres waits forever for a connection by default.
  connectionTimeoutMillis: 5_000,
});

export const prisma = new PrismaClient({ adapter });
