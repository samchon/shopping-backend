import { ArrayUtil, RandomGenerator } from "@nestia/e2e";
import { CartesianProduct } from "cagen";
import { randint } from "tstl";

import { IShoppingPrice } from "@samchon/shopping-api/lib/structures/shoppings/base/IShoppingPrice";
import { IShoppingSaleUnit } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnit";

export const prepare_random_sale_unit = (
  input?: Partial<IShoppingSaleUnit.ICreate>,
): IShoppingSaleUnit.ICreate => {
  // PREPARE NUMBER OF CASES GENERATOR
  const candidateCountMatrix: number[] = ArrayUtil.repeat(randint(1, 3), () =>
    randint(1, 4),
  );
  const cartesian: CartesianProduct = new CartesianProduct(
    ...candidateCountMatrix,
  );

  // DO GENERATE
  return {
    name: RandomGenerator.name(),
    primary: true,
    required: true,
    options: candidateCountMatrix.map((count) => ({
      name: RandomGenerator.name(randint(4, 8)),
      type: "select",
      variable: true,
      candidates: ArrayUtil.repeat(count, () => ({
        name: RandomGenerator.name(randint(3, 12)),
      })),
    })),
    stocks: cartesian.map((indexes) => ({
      name: RandomGenerator.name(randint(4, 12)),
      price: price(),
      choices: indexes
        .map((candidate, option) => ({
          option_index: option,
          candidate_index: candidate,
        }))
        .sort((a, b) =>
          a.option_index === b.option_index
            ? a.candidate_index - b.candidate_index
            : a.option_index - b.option_index,
        ),
      quantity: randint(100, 1_000),
    })),
    ...(input ?? {}),
  };
};

const price = (): IShoppingPrice => {
  const nominal: number = randint(15, 75) * 10000;
  const real: number = (nominal * randint(90, 100)) / 100;
  return { nominal, real };
};
