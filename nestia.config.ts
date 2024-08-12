import { INestiaConfig } from "@nestia/sdk";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";

import { ShoppingModule } from "./src/ShoppingModule";

// const { ShoppingModule } = require("./lib/ShoppingModule");

export const NESTIA_CONFIG: INestiaConfig = {
  input: () => NestFactory.create(ShoppingModule, new FastifyAdapter()),
  output: "src/api",
  swagger: {
    output: "packages/api/swagger.json",
    servers: [
      {
        url: "http://localhost:37001",
        description: "Local Server",
      },
    ],
    security: {
      bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    beautify: true,
  },
  primitive: false,
  simulate: true,
};
export default NESTIA_CONFIG;
