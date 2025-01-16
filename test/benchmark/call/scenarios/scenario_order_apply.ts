import { ShoppingCustomerCartCommodityController } from "../../../../src/controllers/shoppings/customers/orders/ShoppingCustomerCartCommodityController";
import { ShoppingCustomerOrderController } from "../../../../src/controllers/shoppings/customers/orders/ShoppingCustomerOrderController";
import { ShoppingCustomerSaleController } from "../../../../src/controllers/shoppings/customers/sales/ShoppingCustomerSaleController";
import { IFunctionCallBenchmarkScenario } from "../structures/IFunctionCallBenchmarkScenario";

export const scenario_order_apply = (): IFunctionCallBenchmarkScenario => ({
  title: "Order Apply",
  prompt: `
Would you find "Surface Pro 9" in the market?

And then show me the detailed information of it, 
and put the most expensive stock to the shopping cart.

At last, apply the order.
`,
  expected: {
    type: "array",
    items: [
      {
        type: "standalone",
        function: ShoppingCustomerSaleController.prototype.details,
      },
      {
        type: "standalone",
        function: ShoppingCustomerCartCommodityController.prototype.create,
      },
      {
        type: "standalone",
        function: ShoppingCustomerOrderController.prototype.create,
      },
    ],
  },
});
