import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
// import { Prisma, PrismaClient } from "@prisma/client";
import { Prisma, PrismaClient } from "@internal/prisma-phc/client";

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, "error" | "query">
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();

    this.$on("error", (_e) => {
      // Do something
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
