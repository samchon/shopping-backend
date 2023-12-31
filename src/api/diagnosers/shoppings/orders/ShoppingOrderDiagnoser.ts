import { IDiagnosis } from "@samchon/shopping-api/lib/structures/common/IDiagnosis";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";

import { ShoppingOrderGoodDiagnoser } from "./ShoppingOrderGoodDiagnoser";

export namespace ShoppingOrderDiagnoser {
  export const validate =
    (commodities: IShoppingCartCommodity[]) =>
    (input: IShoppingOrder.ICreate): IDiagnosis[] =>
      input.goods
        .map((good, i) => {
          const commodity: IShoppingCartCommodity | undefined =
            commodities.find((c) => c.id === good.commodity_id);
          if (commodity === undefined)
            return {
              accessor: `input.goods[${i}].commodity_id`,
              message: `Commodity#${good.commodity_id} is not found.`,
            };
          return ShoppingOrderGoodDiagnoser.validate(commodity)(good, i);
        })
        .flat();
}
