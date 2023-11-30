import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingSaleSnapshotsController } from "../../base/sales/ShoppingSaleSnapshotsController";

export class ShoppingAdminSaleSnapshotsController extends ShoppingSaleSnapshotsController(
  {
    path: "admins",
    AuthGuard: ShoppingAdminAuth,
  },
) {}
