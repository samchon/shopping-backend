import nest from "@modules/nestjs";
import { Singleton } from "tstl";

export const ShoppingSellerAuth = () => singleton.get()();

const singleton = new Singleton(() =>
    nest.createParamDecorator(async (_0: any, ctx: nest.ExecutionContext) => {
        ctx.switchToHttp().getRequest();
        return null!;
    }),
);
