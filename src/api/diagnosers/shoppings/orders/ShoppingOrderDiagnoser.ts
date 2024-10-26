import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingCartCommodity } from "../../../structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "../../../structures/shoppings/orders/IShoppingOrder";

import { ShoppingOrderGoodDiagnoser } from "./ShoppingOrderGoodDiagnoser";

export namespace ShoppingOrderDiagnoser {
  export const validate = (props: {
    commodities: IShoppingCartCommodity[];
    input: IShoppingOrder.ICreate;
  }): IDiagnosis[] =>
    props.input.goods
      .map((good, i) => {
        const commodity: IShoppingCartCommodity | undefined =
          props.commodities.find((c) => c.id === good.commodity_id);
        if (commodity === undefined)
          return {
            accessor: `input.goods[${i}].commodity_id`,
            message: `Commodity#${good.commodity_id} is not found.`,
          };
        return ShoppingOrderGoodDiagnoser.validate({
          commodity,
          input: good,
          index: i,
        });
      })
      .flat();
}
