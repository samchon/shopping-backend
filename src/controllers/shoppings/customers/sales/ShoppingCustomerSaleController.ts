import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingSalesController } from "../../base/sales/ShoppingSalesController";

export class ShoppingCustomerSaleController extends ShoppingSalesController({
  path: "customers",
  AuthGuard: ShoppingCustomerAuth,
}) {}
