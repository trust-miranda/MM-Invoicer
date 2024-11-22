import { Module } from "@nestjs/common";
import { PrismaSecondService } from "./prisma-second.service";

import { PrismaService } from "./prisma.service";

@Module({
  providers: [PrismaService, PrismaSecondService],
  exports: [PrismaService, PrismaSecondService],
})
export class PrismaModule {}
