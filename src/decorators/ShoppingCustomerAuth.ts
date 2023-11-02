import nest from "@modules/nestjs";
import { Singleton } from "tstl";

export const ShoppingCustomerAuth = (level?: "guest" | "member" | "citizen") =>
    singleton.get(level)();

const singleton = new Singleton((level?: "guest" | "member" | "citizen") =>
    nest.createParamDecorator(async (_0: any, ctx: nest.ExecutionContext) => {
        level;
        ctx.switchToHttp().getRequest();
        return null!;
    }),
);
