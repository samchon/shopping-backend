import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { VariadicSingleton } from "tstl";

import { ShoppingCustomerProvider } from "../providers/shoppings/actors/ShoppingCustomerProvider";
import { SwaggerCustomizer } from "@nestia/core";

export const ShoppingCustomerAuth =
  (level?: "guest" | "member" | "citizen"): ParameterDecorator =>
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
    singleton.get(level ?? "guest")(target, propertyKey, parameterIndex);
  };

const singleton = new VariadicSingleton(
  (level: "guest" | "member" | "citizen") =>
    createParamDecorator(async (_0: any, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return ShoppingCustomerProvider.authorize(level)(request);
    })()
);
