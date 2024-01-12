import { INestiaConfig } from "@nestia/sdk";
import { NestFactory } from "@nestjs/core";

import { ShoppingModule } from "./src/ShoppingModule";

export const NESTIA_CONFIG: INestiaConfig = {
  simulate: true,
  input: () => NestFactory.create(ShoppingModule),
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
  },
};
export default NESTIA_CONFIG;
