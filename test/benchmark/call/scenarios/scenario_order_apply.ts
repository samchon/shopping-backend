import { ShoppingCustomerCartCommodityController } from "../../../../src/controllers/shoppings/customers/orders/ShoppingCustomerCartCommodityController";
import { ShoppingCustomerOrderController } from "../../../../src/controllers/shoppings/customers/orders/ShoppingCustomerOrderController";
import { ShoppingCustomerSaleController } from "../../../../src/controllers/shoppings/customers/sales/ShoppingCustomerSaleController";
import { IFunctionCallBenchmarkScenario } from "../structures/IFunctionCallBenchmarkScenario";
import { ScenarioPromptCollection } from "./ScenarioPromptCollection";

export const scenario_order_apply = (): IFunctionCallBenchmarkScenario => ({
  title: "Order Apply",
  prompt: ScenarioPromptCollection.IPHONE.slice(0, 2).join("\n\n"),
  expected: {
    type: "array",
    items: [
      {
        type: "standalone",
        function: ShoppingCustomerSaleController.prototype.index,
      },
      {
        type: "standalone",
        function: ShoppingCustomerSaleController.prototype.at,
      },
      {
        type: "anyOf",
        anyOf: [
          {
            type: "array",
            items: [
              {
                type: "standalone",
                function:
                  ShoppingCustomerCartCommodityController.prototype.create,
              },
              {
                type: "standalone",
                function: ShoppingCustomerOrderController.prototype.create,
              },
            ],
          },
          {
            type: "standalone",
            function: ShoppingCustomerOrderController.prototype.direct,
          },
        ],
      },
    ],
  },
});
