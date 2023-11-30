import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCouponTicket } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponTicket";
import { tags } from "typia";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/coupons/tickets`)
export class ShoppingCustomerCouponTicketsController {
    @core.TypedRoute.Patch()
    public async index(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedBody() input: IShoppingCouponTicket.IRequest,
    ): Promise<IPage<IShoppingCouponTicket>> {
        customer;
        input;
        return null!;
    }

    @core.TypedRoute.Get(":id")
    public async at(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingCouponTicket> {
        customer;
        id;
        return null!;
    }

    @core.TypedRoute.Post()
    public async create(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedBody() input: IShoppingCouponTicket.ICreate,
    ): Promise<IShoppingCouponTicket> {
        customer;
        input;
        return null!;
    }

    @core.TypedRoute.Post("take")
    public async take(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedBody() input: IShoppingCouponTicket.ITake,
    ): Promise<IShoppingCouponTicket> {
        customer;
        input;
        return null!;
    }
}
