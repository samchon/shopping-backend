import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingOrdersController } from "../../base/orders/ShoppingOrdersController";

export class ShoppingSellerOrdersController extends ShoppingOrdersController({
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
}) {}
