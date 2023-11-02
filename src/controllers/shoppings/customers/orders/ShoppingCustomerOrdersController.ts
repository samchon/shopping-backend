import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingCustomer } from "samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingOrderPublish } from "samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPublish";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingOrdersController } from "../../base/orders/ShoppingOrdersController";

export class ShoppingCustomerOrdersController extends ShoppingOrdersController({
    path: "customers",
    AuthGuard: ShoppingCustomerAuth,
}) {
    @core.TypedRoute.Post()
    public async create(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedBody() input: IShoppingOrderPublish.ICreate,
    ): Promise<IShoppingOrderPublish> {
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
}
