import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Singleton } from "tstl";

export const ShoppingCustomerAuth = (level?: "guest" | "member" | "citizen") =>
  singleton.get(level)();

const singleton = new Singleton((level?: "guest" | "member" | "citizen") =>
  createParamDecorator(async (_0: any, ctx: ExecutionContext) => {
    level;
    ctx.switchToHttp().getRequest();
    return null!;
  }),
);
