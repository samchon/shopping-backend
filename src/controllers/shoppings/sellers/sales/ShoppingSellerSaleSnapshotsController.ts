import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSaleSnapshotsController } from "../../base/sales/ShoppingSaleSnapshotsController";

export class ShoppingSellerSaleSnapshotsController extends ShoppingSaleSnapshotsController(
    {
        path: "sellers",
        AuthGuard: ShoppingSellerAuth,
    },
) {
    public async replica() {}
}
