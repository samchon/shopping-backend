import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingSaleReview } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleReview";

import { ShoppingSaleReviewProvider } from "../../../../providers/shoppings/sales/inquiries/ShoppingSaleSnapshotReviewProvider";

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
    return ShoppingSaleReviewProvider.create(customer)({ id: saleId })(input);
  }

  @core.TypedRoute.Post(":id")
  public async update(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSaleReview.IUpdate,
  ): Promise<IShoppingSaleReview.ISnapshot> {
    return ShoppingSaleReviewProvider.update(customer)({
      id: saleId,
    })(id)(input);
  }
}
