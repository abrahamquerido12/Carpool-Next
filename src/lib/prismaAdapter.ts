import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

const prismaAdapter = PrismaAdapter(prisma);

export default prismaAdapter;
