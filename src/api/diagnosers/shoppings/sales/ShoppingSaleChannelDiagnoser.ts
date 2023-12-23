import { IDiagnosis } from "@samchon/shopping-api/lib/structures/common/IDiagnosis";
import { IShoppingSaleChannel } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleChannel";

import { IIndexedInput } from "../../common/IIndexedInput";
import { UniqueDiagnoser } from "../../common/UniqueDiagnoser";

export namespace ShoppingSaleChannelDiagnoser {
  export const validate = (
    channel: IIndexedInput<IShoppingSaleChannel.ICreate>,
  ): IDiagnosis[] =>
    UniqueDiagnoser.validate<string>({
      key: (str) => str,
      message: (str, i) => ({
        accessor: `input.channels[${i}]`,
        message: `Duplicated category id: "${str}"`,
      }),
    })(channel.data.category_ids);

  export const replica = (
    input: IShoppingSaleChannel,
  ): IShoppingSaleChannel.ICreate => ({
    code: input.code,
    category_ids: input.categories.map((c) => c.id),
  });
}
