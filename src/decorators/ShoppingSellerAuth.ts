import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Singleton } from "tstl";

import { ShoppingSellerProvider } from "../providers/shoppings/actors/ShoppingSellerProvider";

export const ShoppingSellerAuth = () => singleton.get()();

const singleton = new Singleton(() =>
  createParamDecorator(async (_0: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return ShoppingSellerProvider.authorize(request);
  }),
);
