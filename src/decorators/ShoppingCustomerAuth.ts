import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { VariadicSingleton } from "tstl";

import { ShoppingCustomerProvider } from "../providers/shoppings/actors/ShoppingCustomerProvider";

export const ShoppingCustomerAuth = (level?: "guest" | "member" | "citizen") =>
  singleton.get(level ?? "guest")();

const singleton = new VariadicSingleton(
  (level: "guest" | "member" | "citizen") =>
    createParamDecorator(async (_0: any, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return ShoppingCustomerProvider.authorize(level)(request);
    }),
);
