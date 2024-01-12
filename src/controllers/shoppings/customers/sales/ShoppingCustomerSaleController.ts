import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSaleController } from "../../base/sales/ShoppingSaleController";

export class ShoppingCustomerSaleController extends ShoppingSaleController({
  path: "customers",
  AuthGuard: ShoppingCustomerAuth,
}) {}
