import { v4 } from "uuid";

import { ShoppingGlobal } from "../../ShoppingGlobal";

export namespace CacheProvider {
  export interface IProps {
    schema: string;
    table: string;
    key: string;
  }

  export const emplace = async (props: IProps) =>
    ShoppingGlobal.prisma.mv_cache_times.upsert({
      where: {
        schema_table_key: {
          schema: props.schema,
          table: props.table,
          key: props.key,
        },
      },
      create: {
        id: v4(),
        schema: props.schema,
        table: props.table,
        key: props.key,
        value: new Date(),
      },
      update: {
        value: new Date(),
      },
    });

  export const get = async (props: IProps): Promise<Date> => {
    const oldbie = await ShoppingGlobal.prisma.mv_cache_times.findFirst({
      where: {
        schema: props.schema,
        table: props.table,
        key: props.key,
      },
    });
    if (!oldbie) return new Date(0);

    const record = await emplace(props);
    return record.value;
  };
}
