import core from "@nestia/core";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderDiscountable";
import { IShoppingOrderPrice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPrice";
import { tags } from "typia";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingOrdersController } from "../../base/orders/ShoppingOrdersController";

export class ShoppingCustomerOrdersController extends ShoppingOrdersController({
    path: "customers",
    AuthGuard: ShoppingCustomerAuth,
}) {
    @core.TypedRoute.Post()
    public async create(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedBody() input: IShoppingOrder.ICreate,
    ): Promise<IShoppingOrder> {
        customer;
        input;
        return null!;
    }

    @core.TypedRoute.Delete(":id")
    public async erase(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<void> {
        customer;
        id;
    }

    @core.TypedRoute.Get(":id/price")
    public async price(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingOrderPrice> {
        customer;
        id;
        return null!;
    }

    @core.TypedRoute.Patch(":id/discountable")
    public async discountable(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("id") id: string & tags.Format<"uuid">,
        @core.TypedBody() input: IShoppingOrderDiscountable.IRequest,
    ): Promise<IShoppingOrderDiscountable> {
        customer;
        id;
        input;
        return null!;
    }

    @core.TypedRoute.Put(":id/discount")
    public async discount(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("id") id: string & tags.Format<"uuid">,
        @core.TypedBody() input: IShoppingOrderPrice.ICreate,
    ): Promise<IShoppingOrderPrice> {
        customer;
        id;
        input;
        return null!;
    }
}
