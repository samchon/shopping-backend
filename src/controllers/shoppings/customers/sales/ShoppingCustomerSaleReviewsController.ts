import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingCustomer } from "samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingSaleReview } from "samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleReview";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSaleReviewsController } from "../../base/sales/ShoppingSaleReviewsController";

export class ShoppingCustomerSaleReviewsController extends ShoppingSaleReviewsController(
    {
        path: "customers",
        AuthGuard: ShoppingCustomerAuth,
    },
) {
    @core.TypedRoute.Post()
    public async create(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
        @core.TypedBody() input: IShoppingSaleReview.ICreate,
    ): Promise<IShoppingSaleReview> {
        customer;
        saleId;
        input;
        return null!;
    }

    @core.TypedRoute.Post(":id")
    public async update(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
        @core.TypedParam("id") id: string & tags.Format<"uuid">,
        @core.TypedBody() input: IShoppingSaleReview.IUpdate,
    ): Promise<IShoppingSaleReview.ISnapshot> {
        customer;
        saleId;
        id;
        input;
        return null!;
    }

    @core.TypedRoute.Delete(":id")
    public async erase(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
        @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<void> {
        customer;
        saleId;
        id;
    }
}
