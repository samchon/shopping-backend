import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingSaleChannel } from "../../../structures/shoppings/sales/IShoppingSaleChannel";

import { UniqueDiagnoser } from "../../common/UniqueDiagnoser";

export namespace ShoppingSaleChannelDiagnoser {
  export const validate = (
    channel: IShoppingSaleChannel.ICreate
  ): IDiagnosis[] =>
    UniqueDiagnoser.validate<string>({
      key: (str) => str,
      message: (str, i) => ({
        accessor: `input.channels[${i}]`,
        message: `Duplicated category id: "${str}"`,
      }),
      items: channel.category_ids,
    });

  export const replica = (
    input: IShoppingSaleChannel
  ): IShoppingSaleChannel.ICreate => ({
    code: input.code,
    category_ids: input.categories.map((c) => c.id),
  });
}
