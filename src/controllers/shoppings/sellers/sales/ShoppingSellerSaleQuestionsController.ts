import core from "@nestia/core";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSaleInquiryAnswer } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryAnswer";
import { tags } from "typia";

import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSaleQuestionsController } from "../../base/sales/ShoppingSaleQuestionsController";

export class ShoppingSellerSaleQuestionsController extends ShoppingSaleQuestionsController(
    {
        path: "sellers",
        AuthGuard: ShoppingSellerAuth,
    },
) {
    @core.TypedRoute.Post()
    public async create(
        @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
        @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
        @core.TypedBody() input: IShoppingSaleInquiryAnswer.ICreate,
    ): Promise<IShoppingSaleInquiryAnswer> {
        seller;
        saleId;
        input;
        return null!;
    }

    @core.TypedRoute.Put(":id")
    public async update(
        @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
        @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
        @core.TypedParam("id") id: string & tags.Format<"uuid">,
        @core.TypedBody() input: IShoppingSaleInquiryAnswer.IUpdate,
    ): Promise<IShoppingSaleInquiryAnswer.ISnapshot> {
        seller;
        saleId;
        id;
        input;
        return null!;
    }
}
