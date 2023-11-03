import nest from "@modules/nestjs";
import core from "@nestia/core";

import { IPage } from "samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingCoupon } from "samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingCouponsReadableController<
    Actor extends IShoppingActorEntity,
>(props: IShoppingControllerProps) {
    @nest.Controller(`shoppings/${props.path}/coupons`)
    abstract class ShoppingCouponsReadableController {
        @core.TypedRoute.Patch()
        public async index(
            @props.AuthGuard() actor: Actor,
            @core.TypedBody() input: IShoppingCoupon.IRequest,
        ): Promise<IPage<IShoppingCoupon>> {
            actor;
            input;
            return null!;
        }

        @core.TypedRoute.Get(":id")
        public async at(
            @props.AuthGuard() actor: Actor,
            @core.TypedParam("id") id: string,
        ): Promise<IShoppingCoupon> {
            actor;
            id;
            return null!;
        }
    }
    return ShoppingCouponsReadableController;
}
