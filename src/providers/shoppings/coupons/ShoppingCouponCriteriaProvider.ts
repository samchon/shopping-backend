import { ArrayUtil } from "@nestia/e2e";
import { Prisma } from "@prisma/client";
import { IPointer } from "tstl";
import typia from "typia";
import { v4 } from "uuid";

import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingCouponCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponCriteria";
import { IShoppingCouponFunnelCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponFunnelCriteria";
import { IShoppingCouponSaleCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponSaleCriteria";
import { IShoppingCouponSectionCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponSectionCriteria";
import { IShoppingCouponSellerCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponSellerCriteria";

import { MapUtil } from "../../../api/utils/MapUtil";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingCouponFunnelCriteriaProvider } from "./ShoppingCouponFunnelCriteriaProvider";
import { ShoppingCouponSaleCriteriaProvider } from "./ShoppingCouponSaleCriteriaProvider";
import { ShoppingCouponSectionCriteriaProvider } from "./ShoppingCouponSectionCriteriaProvider";
import { ShoppingCouponSellerCriteriaProvider } from "./ShoppingCouponSellerCriteriaProvider";

export namespace ShoppingCouponCriterialProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = async (
      inputList: Prisma.shopping_coupon_criteriasGetPayload<
        ReturnType<typeof select>
      >[],
    ): Promise<IShoppingCouponCriteria[]> => {
      const gather = async (
        direction: "include" | "exclude",
      ): Promise<IShoppingCouponCriteria[]> => {
        const dict: Map<
          IShoppingCouponCriteria.Type,
          Prisma.shopping_coupon_criteriasGetPayload<
            ReturnType<typeof select>
          >[]
        > = new Map();
        for (const input of inputList.filter(
          (input) => input.direction === direction,
        ))
          MapUtil.take(
            dict,
            typia.assert<IShoppingCouponCriteria.Type>(input.type),
            () => [],
          ).push(input);
        return ArrayUtil.asyncMap(
          [...dict.entries()],
          async ([type, inputList]) =>
            type === "section"
              ? <IShoppingCouponSectionCriteria>{
                  type,
                  direction,
                  sections:
                    ShoppingCouponSectionCriteriaProvider.json.transform(
                      inputList.map((i) => i.of_section!),
                    ),
                }
              : type === "sale"
                ? <IShoppingCouponSaleCriteria>{
                    type,
                    direction,
                    sales:
                      await ShoppingCouponSaleCriteriaProvider.json.transform(
                        inputList.map((i) => i.of_sale!),
                      ),
                  }
                : type === "seller"
                  ? <IShoppingCouponSellerCriteria>{
                      type,
                      direction,
                      sellers:
                        ShoppingCouponSellerCriteriaProvider.json.transform(
                          inputList.map((i) => i.of_seller!),
                        ),
                    }
                  : <IShoppingCouponFunnelCriteria>{
                      type,
                      direction,
                      funnels:
                        ShoppingCouponFunnelCriteriaProvider.json.transform(
                          inputList.map((i) => i.of_funnel!),
                        ),
                    },
        );
      };
      const output = [
        ...(await gather("include")),
        ...(await gather("exclude")),
      ];
      return output;
    };
    export const select = () =>
      ({
        include: {
          of_section: ShoppingCouponSectionCriteriaProvider.json.select(),
          of_sale: ShoppingCouponSaleCriteriaProvider.json.select(),
          of_seller: ShoppingCouponSellerCriteriaProvider.json.select(),
          of_funnel: ShoppingCouponFunnelCriteriaProvider.json.select(),
        },
      }) satisfies Prisma.shopping_coupon_criteriasFindManyArgs;
  }

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const collect = async (props: {
    actor: IShoppingSeller.IInvert | IShoppingAdministrator.IInvert;
    inputs: IShoppingCouponCriteria.ICreate[];
  }) => {
    if (
      props.actor.type === "seller" &&
      props.inputs
        .filter((i) => i.direction === "include")
        .every((i) => i.type !== "sale" && i.type !== "seller")
    )
      throw ErrorProvider.forbidden({
        accessor: "input.criterias[].type",
        message:
          "Seller must contain at least one sale or seller criteria of include direction.",
      });

    const counter: IPointer<number> = { value: 0 };
    const matrix = await ArrayUtil.asyncMap(props.inputs, async (input) => {
      const base = (): IShoppingCouponCriteria.ICollectBase => ({
        id: v4(),
        direction: input.direction,
        type: input.type,
      });
      if (input.type === "section")
        return ShoppingCouponSectionCriteriaProvider.collect({
          counter,
          base,
          input,
        });
      else if (input.type === "sale")
        return ShoppingCouponSaleCriteriaProvider.collect({
          actor: props.actor,
          counter,
          base,
          input,
        });
      else if (input.type === "seller")
        return ShoppingCouponSellerCriteriaProvider.collect({
          actor: props.actor,
          counter,
          base,
          input,
        });
      else
        return ShoppingCouponFunnelCriteriaProvider.collect({
          counter,
          base,
          input,
        });
    });
    return (
      matrix satisfies Prisma.shopping_coupon_criteriasCreateWithoutCouponInput[][]
    ).flat();
  };
}
