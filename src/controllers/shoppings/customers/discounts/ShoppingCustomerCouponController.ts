import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingCouponsReadableController } from "../../base/discounts/ShoppingCouponsReadableController";

export class ShoppingCustomerCouponController extends ShoppingCouponsReadableController(
  {
    path: "customers",
    AuthGuard: ShoppingCustomerAuth,
  },
) {}
