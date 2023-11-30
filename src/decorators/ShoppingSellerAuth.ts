import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Singleton } from "tstl";

export const ShoppingSellerAuth = () => singleton.get()();

const singleton = new Singleton(() =>
  createParamDecorator(async (_0: any, ctx: ExecutionContext) => {
    ctx.switchToHttp().getRequest();
    return null!;
  }),
);
