import { TestValidator } from "@nestia/e2e";
import { HashMap, hash } from "tstl";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ActorPath } from "../../../../../../src/typings/ActorPath";
import { ConnectionPool } from "../../../../../ConnectionPool";
import { TestGlobal } from "../../../../../TestGlobal";

export const validate_sale_index = async (props: {
  pool: ConnectionPool;
  sales: IShoppingSale[];
  visibleInCustomer: boolean;
}) => {
  const fetcher =
    (connection: ShoppingApi.IConnection) =>
    (actor: ActorPath) =>
    (input: IPage.IRequest) =>
      ShoppingApi.functional.shoppings[actor].sales.index(connection, input);
  await validate_in_viewer_level(fetcher(props.pool.admin))(props.sales)(
    "admins",
  )(true);
  await validate_in_viewer_level(fetcher(props.pool.customer))(props.sales)(
    "customers",
  )(props.visibleInCustomer);
  await validate_in_seller_level(props.pool.seller)(fetcher(props.pool.seller))(
    props.sales,
  );
};

type PageFetcher = (
  actor: ActorPath,
) => (input: IShoppingSale.IRequest) => Promise<IPage<IShoppingSale.ISummary>>;

const validate_in_viewer_level =
  (fetcher: PageFetcher) =>
  (saleList: IShoppingSale[]) =>
  (actor: ActorPath) =>
  async (visible: boolean) => {
    const page: IPage<IShoppingSale.ISummary> = await fetcher(actor)({
      limit: saleList.length,
      sort: ["-sale.created_at"],
    });
    const filtered: IShoppingSale.ISummary[] = page.data.filter(
      (summary) => saleList.find((s) => s.id === summary.id) !== undefined,
    );
    TestValidator.predicate(`page API of ${actor} (${visible})`)(() =>
      visible === true ? !!filtered.length : !filtered.length,
    );
  };

const validate_in_seller_level =
  (connection: ShoppingApi.IConnection) =>
  (fetcher: PageFetcher) =>
  async (saleList: IShoppingSale[]) => {
    const dict: HashMap<IShoppingSeller.IInvert, IShoppingSale[]> =
      create_entity_map();
    for (const sale of saleList) {
      const array: IShoppingSale[] = dict.take(sale.seller, () => []);
      array.push(sale);
    }

    for (const it of dict) {
      const seller: IShoppingSeller.IInvert = it.first;
      const mySales: IShoppingSale[] = it.second;

      await ShoppingApi.functional.shoppings.customers.authenticate.login(
        connection,
        {
          email: seller.member.emails[0].value,
          password: TestGlobal.PASSWORD,
        },
      );

      const index: IPage<IShoppingSale.ISummary> = await fetcher("sellers")({
        limit: saleList.length,
      });
      TestValidator.index("seller ownership")(mySales)(index.data);
    }
  };

const create_entity_map = <Key extends { id: string }, Value>(): HashMap<
  Key,
  Value
> =>
  new HashMap(
    (entity) => hash(entity.id),
    (x, y) => x.id === y.id,
  );
