import { Prisma } from "@prisma/sdk";
import { IPointer } from "tstl";

import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingCouponCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponCriteria";
import { IShoppingCouponSellerCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponSellerCriteria";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingSellerProvider } from "../actors/ShoppingSellerProvider";

export namespace ShoppingCouponSellerCriteriaProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_coupon_seller_criteriasGetPayload<
        ReturnType<typeof select>
      >[],
    ): IShoppingSeller[] =>
      input.map((input) => ShoppingSellerProvider.json.transform(input.seller));
    export const select = () =>
      ({
        include: {
          seller: ShoppingSellerProvider.json.select(),
        },
      }) satisfies Prisma.shopping_coupon_seller_criteriasFindManyArgs;
  }

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const collect = async (props: {
    actor: IShoppingAdministrator.IInvert | IShoppingSeller.IInvert;
    counter: IPointer<number>;
    base: () => IShoppingCouponCriteria.ICollectBase;
    input: IShoppingCouponSellerCriteria.ICreate;
  }) => {
    if (
      props.actor.type === "seller" &&
      props.input.seller_ids.some((id) => id !== props.actor.id)
    )
      throw ErrorProvider.forbidden({
        accessor: "input.criterias[].seller_ids",
        message: "You cannot add other sellers.",
      });
    const sellers = await ShoppingGlobal.prisma.shopping_sellers.findMany({
      where: {
        id: {
          in: props.input.seller_ids,
        },
      },
      select: {
        id: true,
      },
    });
    if (sellers.length !== props.input.seller_ids.length)
      throw ErrorProvider.badRequest({
        accessor: "input.criterias[].seller_ids",
        message: "Some sellers are not found.",
      });
    return props.input.seller_ids.map((sid) => ({
      ...props.base(),
      sequence: props.counter.value++,
      of_seller: {
        create: {
          shopping_seller_id: sid,
        },
      },
    })) satisfies Prisma.shopping_coupon_criteriasCreateWithoutCouponInput[];
  };
}
