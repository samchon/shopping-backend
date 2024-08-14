import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Singleton } from "tstl";

import { ShoppingSellerProvider } from "../providers/shoppings/actors/ShoppingSellerProvider";
import { SwaggerCustomizer } from "@nestia/core";

export const ShoppingSellerAuth =
  (): ParameterDecorator =>
  (
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ): void => {
    SwaggerCustomizer((props) => {
      props.route.security ??= [];
      props.route.security.push({
        bearer: [],
      });
    })(target, propertyKey as string, undefined!);
    singleton.get()(target, propertyKey, parameterIndex);
  };

const singleton = new Singleton(() =>
  createParamDecorator(async (_0: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return ShoppingSellerProvider.authorize(request);
  })()
);
