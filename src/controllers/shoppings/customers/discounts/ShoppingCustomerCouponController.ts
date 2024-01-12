import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingCouponReadableController } from "../../base/discounts/ShoppingCouponReadableController";

export class ShoppingCustomerCouponController extends ShoppingCouponReadableController(
  {
    path: "customers",
    AuthGuard: ShoppingCustomerAuth,
  },
) {}
