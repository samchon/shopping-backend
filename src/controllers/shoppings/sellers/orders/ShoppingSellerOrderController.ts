import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingOrdersController } from "../../base/orders/ShoppingOrdersController";

export class ShoppingSellerOrderController extends ShoppingOrdersController({
  path: "sellers",
  AuthGuard: ShoppingSellerAuth,
}) {}
