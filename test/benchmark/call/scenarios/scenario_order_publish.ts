import { ShoppingCustomerCartCommodityController } from "../../../../src/controllers/shoppings/customers/orders/ShoppingCustomerCartCommodityController";
import { ShoppingCustomerOrderController } from "../../../../src/controllers/shoppings/customers/orders/ShoppingCustomerOrderController";
import { ShoppingCustomerOrderPublishController } from "../../../../src/controllers/shoppings/customers/orders/ShoppingCustomerOrderPublishController";
import { ShoppingCustomerSaleController } from "../../../../src/controllers/shoppings/customers/sales/ShoppingCustomerSaleController";
import { IFunctionCallBenchmarkScenario } from "../structures/IFunctionCallBenchmarkScenario";
import { ScenarioPromptCollection } from "./ScenarioPromptCollection";

export const scenario_order_publish = (): IFunctionCallBenchmarkScenario => ({
  title: "Order Publish",
  prompt: ScenarioPromptCollection.SP9.slice(0, 3).join("\n\n"),
  expected: {
    type: "array",
    items: [
      {
        type: "standalone",
        function: ShoppingCustomerSaleController.prototype.details,
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
      {
        type: "standalone",
        function: ShoppingCustomerOrderPublishController.prototype.create,
      },
    ],
  },
});
