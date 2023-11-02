import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingCustomer } from "samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingSaleQuestion } from "samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSaleQuestionsController } from "../../base/sales/ShoppingSaleQuestionsController";

export class ShoppingCustomerSaleQuestionsController extends ShoppingSaleQuestionsController(
    {
        path: "customers",
        AuthGuard: ShoppingCustomerAuth,
    },
) {
    @core.TypedRoute.Post()
    public async create(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
        @core.TypedBody() input: IShoppingSaleQuestion.ICreate,
    ): Promise<IShoppingSaleQuestion> {
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
        @core.TypedBody() input: IShoppingSaleQuestion.IUpdate,
    ): Promise<IShoppingSaleQuestion.ISnapshot> {
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
