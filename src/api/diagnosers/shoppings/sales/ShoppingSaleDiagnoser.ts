import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingSale } from "../../../structures/shoppings/sales/IShoppingSale";

import { ShoppingSaleSnapshotDiagnoser } from "./ShoppingSaleSnapshotDiagnoser";

export namespace ShoppingSaleDiagnoser {
  export const validate = (sale: IShoppingSale.ICreate): IDiagnosis[] => {
    const output: IDiagnosis[] = [];

    // PROPERTIES
    if (
      sale.opened_at &&
      sale.closed_at &&
      new Date(sale.closed_at).getTime() < new Date(sale.opened_at).getTime()
    )
      output.push({
        accessor: "input.closed_at",
        message: "Closed date is earlier than opened date",
      });

    // SNAPSHOT
    output.push(...ShoppingSaleSnapshotDiagnoser.validate(sale));
    return output;
  };

  export const replica = (sale: IShoppingSale): IShoppingSale.ICreate => ({
    ...ShoppingSaleSnapshotDiagnoser.replica(sale),
    section_code: sale.section.code,
    opened_at: sale.opened_at,
    closed_at: sale.closed_at,
  });

  export const readable = (props: {
    sale: IShoppingSale.ITimestamps;
    accessor: string;
    checkPause: boolean;
  }): IDiagnosis[] => {
    const output: IDiagnosis[] = [];

    // OPENING TIME
    if (props.sale.opened_at === null)
      output.push({
        accessor: props.accessor,
        message: `The sale has not been opened.`,
      });
    else if (new Date(props.sale.opened_at).getTime() > Date.now())
      output.push({
        accessor: props.accessor,
        message: `The sale has not been opened yet.`,
      });

    // CLOSING OR STOPPING TIMES
    const timestamp = (status: string, time: string | null) => {
      if (time !== null && Date.now() >= new Date(time).getTime())
        output.push({
          accessor: props.accessor,
          message: `The sale has been ${status}.`,
        });
    };
    timestamp("closed", props.sale.closed_at);
    if (props.checkPause) timestamp("paused", props.sale.paused_at);
    timestamp("suspended", props.sale.suspended_at);

    return output;
  };
}
