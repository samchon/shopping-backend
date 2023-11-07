import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingCouponsWritableController } from "../../base/discounts/ShoppingCouponsWritableController";

export class ShoppingAdminCouponsController extends ShoppingCouponsWritableController(
    {
        path: "admins",
        AuthGuard: ShoppingAdminAuth,
    },
) {}
