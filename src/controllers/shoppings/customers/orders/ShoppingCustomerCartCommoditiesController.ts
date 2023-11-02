import nest from "@modules/nestjs";
import core from "@nestia/core";
import { tags } from "typia";

import { IPage } from "samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@nest.Controller(`shoppings/customers/orders/cart/:cartId/commodities`)
export class ShoppingCustomerCartCommoditiesController {
    @core.TypedRoute.Get()
    public async index(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("cartId")
        cartId: null | (string & tags.Format<"uuid">),
        @core.TypedBody() input: IShoppingCartCommodity.IRequest,
    ): Promise<IPage<IShoppingCartCommodity>> {
        customer;
        cartId;
        input;
        return null!;
    }

    @core.TypedRoute.Get(":id")
    public async at(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("cartId")
        cartId: null | (string & tags.Format<"uuid">),
        @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingCartCommodity> {
        customer;
        cartId;
        id;
        return null!;
    }

    @core.TypedRoute.Post()
    public async create(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("cartId")
        cartId: null | (string & tags.Format<"uuid">),
        @core.TypedBody() input: IShoppingCartCommodity.ICreate,
    ): Promise<IShoppingCartCommodity> {
        customer;
        cartId;
        input;
        return null!;
    }

    @core.TypedRoute.Put(":id")
    public async update(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("cartId")
        cartId: null | (string & tags.Format<"uuid">),
        @core.TypedParam("id") id: string & tags.Format<"uuid">,
        @core.TypedBody() input: IShoppingCartCommodity.IUpdate,
    ): Promise<IShoppingCartCommodity> {
        customer;
        cartId;
        id;
        input;
        return null!;
    }

    @core.TypedRoute.Delete(":id")
    public async erase(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("cartId")
        cartId: null | (string & tags.Format<"uuid">),
        @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<void> {
        customer;
        cartId;
        id;
    }
}
