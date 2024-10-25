import { Prisma } from "@prisma/client";
import { IPointer } from "tstl";

import { IShoppingCouponCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponCriteria";
import { IShoppingCouponSectionCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponSectionCriteria";
import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingSectionProvider } from "../systematic/ShoppingSectionProvider";

export namespace ShoppingCouponSectionCriteriaProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      inputList: Prisma.shopping_coupon_section_criteriasGetPayload<
        ReturnType<typeof select>
      >[]
    ): IShoppingSection[] =>
      inputList.map((input) =>
        ShoppingSectionProvider.json.transform(input.section)
      );

    export const select = () =>
      ({
        include: {
          section: ShoppingSectionProvider.json.select(),
        },
      }) satisfies Prisma.shopping_coupon_section_criteriasFindManyArgs;
  }

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const collect = async (props: {
    counter: IPointer<number>;
    base: () => IShoppingCouponCriteria.ICollectBase;
    input: IShoppingCouponSectionCriteria.ICreate;
  }) => {
    const sectionList = await ShoppingGlobal.prisma.shopping_sections.findMany({
      where: {
        code: {
          in: props.input.section_codes,
        },
      },
    });
    if (sectionList.length !== props.input.section_codes.length)
      throw ErrorProvider.notFound({
        accessor: "input.criterias[].section_codes",
        message: "Some sections are not found.",
      });
    return sectionList.map((section) => ({
      ...props.base(),
      sequence: props.counter.value++,
      of_section: {
        create: {
          shopping_section_id: section.id,
        },
      },
    })) satisfies Prisma.shopping_coupon_criteriasCreateWithoutCouponInput[];
  };
}
