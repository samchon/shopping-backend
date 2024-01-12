import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingCouponsWritableController } from "../../base/discounts/ShoppingCouponsWritableController";

export class ShoppingSellerCouponController extends ShoppingCouponsWritableController(
  {
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
  },
) {}
