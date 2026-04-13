import { INestiaConfig } from "@nestia/sdk";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";

import { ShoppingModule } from "./src/ShoppingModule";

export default {
  input: () => NestFactory.create(ShoppingModule, new FastifyAdapter()),
  output: "src/api",
  swagger: {
    servers: [
      {
        url: "https://shopping-be.wrtn.ai",
        description: "Production, the real server",
      },
    ],
    security: {
      bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    output: "packages/api/swagger.json",
  },
  simulate: true,
  primitive: false,
} satisfies INestiaConfig;
