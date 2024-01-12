import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingOrderController } from "../../base/orders/ShoppingOrderController";

export class ShoppingSellerOrderController extends ShoppingOrderController({
  path: "sellers",
  AuthGuard: ShoppingSellerAuth,
}) {}
