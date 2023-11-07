import core from "@nestia/core";

import { IShoppingActorEntity } from "samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingCoupon } from "samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";

import { IShoppingControllerProps } from "../IShoppingControllerProps";
import { ShoppingCouponsReadableController } from "./ShoppingCouponsReadableController";

export function ShoppingCouponsWritableController<
    Actor extends IShoppingActorEntity,
>(props: IShoppingControllerProps) {
    abstract class ShoppingCouponsWritableController extends ShoppingCouponsReadableController<Actor>(
        props,
    ) {
        @core.TypedRoute.Post()
        public async create(
            @props.AuthGuard() actor: Actor,
            @core.TypedBody() input: IShoppingCoupon.ICreate,
        ): Promise<IShoppingCoupon> {
            actor;
            input;
            return null!;
        }

        @core.TypedRoute.Put(":id")
        public async update(
            @props.AuthGuard() actor: Actor,
            @core.TypedParam("id") id: string,
            @core.TypedBody() input: IShoppingCoupon.IUpdate,
        ): Promise<IShoppingCoupon> {
            actor;
            id;
            input;
            return null!;
        }

        @core.TypedRoute.Delete(":id")
        public async erase(
            @props.AuthGuard() actor: Actor,
            @core.TypedParam("id") id: string,
        ): Promise<void> {
            actor;
            id;
        }
    }
    return ShoppingCouponsWritableController;
}
