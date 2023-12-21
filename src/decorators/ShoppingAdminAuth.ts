import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Singleton } from "tstl";

import { ShoppingAdministratorProvider } from "../providers/shoppings/actors/ShoppingAdministratorProvider";

export const ShoppingAdminAuth = () => singleton.get()();

const singleton = new Singleton(() =>
  createParamDecorator(async (_0: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return ShoppingAdministratorProvider.authorize(request);
  }),
);
