// lib/prisma.ts

import { PrismaClient as PrismaClienteDBPortal } from "../prisma/@/prisma/generated/db_Portal";
import { PrismaClient as PrismaClientDBPHC } from "../prisma/@/prisma/generated/db_Phc";

export const prismaDBPortal = new PrismaClientDBPortal();
export const prismaDBPhc = new PrismaClientDBPhc();
