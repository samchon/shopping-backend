import { ArrayUtil } from "@nestia/e2e";
import { Prisma } from "@prisma/client";
import { IPointer } from "tstl";

import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingCouponCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponCriteria";
import { IShoppingCouponSaleCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponSaleCriteria";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingSaleProvider } from "../sales/ShoppingSaleProvider";

export namespace ShoppingCouponSaleCriteriaProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      inputList: Prisma.shopping_coupon_sale_criteriasGetPayload<
        ReturnType<typeof select>
      >[]
    ): Promise<IShoppingSale.ISummary[]> =>
      ArrayUtil.asyncMap(inputList)((input) =>
        ShoppingSaleProvider.summary.transform(input.sale)
      );
    export const select = () =>
      ({
        include: {
          sale: ShoppingSaleProvider.summary.select(),
        },
      }) satisfies Prisma.shopping_coupon_sale_criteriasFindManyArgs;
  }

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const collect = async (props: {
    actor: IShoppingAdministrator.IInvert | IShoppingSeller.IInvert;
    counter: IPointer<number>;
    base: () => IShoppingCouponCriteria.ICollectBase;
    input: IShoppingCouponSaleCriteria.ICreate;
  }) => {
    const saleList = await ShoppingGlobal.prisma.shopping_sales.findMany({
      where: {
        id: {
          in: props.input.sale_ids,
        },
        sellerCustomer:
          props.actor.type === "seller"
            ? {
                member: {
                  of_seller: {
                    id: props.actor.id,
                  },
                },
              }
            : {},
      },
      select: {
        id: true,
      },
    });
    if (saleList.length !== props.input.sale_ids.length)
      throw ErrorProvider.badRequest({
        accessor: "input.criterias[].sale_ids",
        message: "Some sales are not found.",
      });
    return props.input.sale_ids.map((sid) => ({
      ...props.base(),
      sequence: props.counter.value++,
      of_sale: {
        create: {
          shopping_sale_id: sid,
        },
      },
    })) satisfies Prisma.shopping_coupon_criteriasCreateWithoutCouponInput[];
  };
}
