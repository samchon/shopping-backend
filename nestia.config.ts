import { INestiaConfig } from "@nestia/sdk";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";

import { ShoppingModule } from "./src/ShoppingModule";
import { ShoppingAdminModule } from "./src/controllers/shoppings/admins/ShoppingAdminModule";
import { ShoppingCustomerModule } from "./src/controllers/shoppings/customers/ShoppingCustomerModule";
import { ShoppingSellerModule } from "./src/controllers/shoppings/sellers/ShoppingSellerModule";

const BASIC = {
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
  beautify: true,
} satisfies Pick<
  INestiaConfig.ISwaggerConfig,
  "servers" | "security" | "beautify"
>;

export const NESTIA_CONFIG: INestiaConfig[] = [
  {
    input: () => NestFactory.create(ShoppingModule, new FastifyAdapter()),
    output: "src/api",
    swagger: {
      ...BASIC,
      output: "packages/api/swagger.json",
    },
    primitive: false,
    simulate: false,
  },
  {
    input: () => NestFactory.create(ShoppingAdminModule, new FastifyAdapter()),
    swagger: {
      ...BASIC,
      output: "packages/api/admin.swagger.json",
    },
  },
  {
    input: () =>
      NestFactory.create(ShoppingCustomerModule, new FastifyAdapter()),
    swagger: {
      ...BASIC,
      output: "packages/api/customer.swagger.json",
    },
  },
  {
    input: () => NestFactory.create(ShoppingSellerModule, new FastifyAdapter()),
    swagger: {
      ...BASIC,
      output: "packages/api/seller.swagger.json",
    },
  },
];
export default NESTIA_CONFIG;
