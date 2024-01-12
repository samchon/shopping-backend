import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingCouponWritableController } from "../../base/discounts/ShoppingCouponWritableController";

export class ShoppingSellerCouponController extends ShoppingCouponWritableController(
  {
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
  },
) {}
