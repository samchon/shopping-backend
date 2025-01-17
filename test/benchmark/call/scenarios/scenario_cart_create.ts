import { ShoppingCustomerCartCommodityController } from "../../../../src/controllers/shoppings/customers/orders/ShoppingCustomerCartCommodityController";
import { ShoppingCustomerSaleController } from "../../../../src/controllers/shoppings/customers/sales/ShoppingCustomerSaleController";
import { IFunctionCallBenchmarkScenario } from "../structures/IFunctionCallBenchmarkScenario";
import { ScenarioPromptCollection } from "./ScenarioPromptCollection";

export const scenario_cart_create = (): IFunctionCallBenchmarkScenario => ({
  title: "Cart Create",
  prompt: ScenarioPromptCollection.SP9.slice(0, 2).join("\n\n"),
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
    ],
  },
});
