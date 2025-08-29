import { ArrayUtil } from "@nestia/e2e";
import fs from "fs";

import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";
import { IShoppingChannelCategory } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannelCategory";

import { ShoppingConfiguration } from "../../ShoppingConfiguration";
import { ShoppingChannelCategoryProvider } from "../../providers/shoppings/systematic/ShoppingChannelCategoryProvider";
import { ShoppingChannelProvider } from "../../providers/shoppings/systematic/ShoppingChannelProvider";
import { CsvUtil } from "../../utils/CsvUtil";

export namespace ShoppingChannelSeeder {
  export const seed = async (): Promise<void> => {
    const dict: Map<string, IHierarchy> = new Map();
    for (const input of CHANNELS) await seedChannel(dict)(input);
    await seedCategories(dict);
  };

  const seedChannel =
    (dict: Map<string, IHierarchy>) =>
    async (input: IShoppingChannel.ICreate): Promise<void> => {
      const channel: IShoppingChannel =
        await ShoppingChannelProvider.create(input);
      dict.set(channel.code, { channel, last: [] });
    };

  const seedCategories = async (
    dict: Map<string, IHierarchy>,
  ): Promise<void> => {
    const input: IRawCategory[] = await CsvUtil.parse(
      "channel",
      "name",
      "code",
    )(
      await fs.promises.readFile(
        `${ShoppingConfiguration.ROOT}/assets/raw/raw_shopping_channel_categories.csv`,
        "utf8",
      ),
    );
    await ArrayUtil.asyncMap(input, async (raw, i) => {
      const [name, level] = getLevel(raw.name);
      const hierarchy: IHierarchy | undefined = dict.get(raw.channel);
      if (hierarchy === undefined)
        throw new Error(`Unable to find the channel record at line: ${i + 1}.`);

      const parent: IShoppingChannelCategory | null = (() => {
        if (level === 0) return null;
        const parent = dict.get(raw.channel)?.last[level - 1];
        if (parent === undefined)
          throw new Error(
            `Unable to find the parent category at line: ${i + 1}.`,
          );
        return parent;
      })();

      const category: IShoppingChannelCategory =
        await ShoppingChannelCategoryProvider.create({
          channel: hierarchy.channel,
          input: {
            parent_id: parent?.id ?? null,
            code: raw.code,
            name,
          },
        });
      hierarchy.last[level] = category;
    });
  };

  const getLevel = (name: string): [string, number] => {
    // eslint-disable-next-line
    let spaces: number = 0;
    while (name[spaces] === " ") ++spaces;
    return [name.slice(spaces), spaces / 2];
  };
}

const CHANNELS: IShoppingChannel.ICreate[] = [
  {
    code: "samchon",
    name: "Samchon Shopping Mall",
  },
];

interface IHierarchy {
  channel: IShoppingChannel;
  last: IShoppingChannelCategory[];
}

interface IRawCategory {
  channel: string;
  code: string;
  name: string;
}
