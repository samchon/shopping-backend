import { ArrayUtil } from "@nestia/e2e";
import { Prisma } from "@prisma/sdk";
import typia from "typia";
import { v4 } from "uuid";

import { IDiagnosis } from "@samchon/shopping-api/lib/structures/common/IDiagnosis";
import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingDelivery } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDelivery";
import { IShoppingDeliveryJourney } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryJourney";
import { IShoppingDeliveryPiece } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryPiece";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { PaginationUtil } from "../../../utils/PaginationUtil";
import { ShoppingSellerProvider } from "../actors/ShoppingSellerProvider";
import { ShoppingDeliveryJourneyProvider } from "./ShoppingDeliveryJourneyProvider";
import { ShoppingDeliveryPieceProvider } from "./ShoppingDeliveryPieceProvider";
import { ShoppingDeliveryShipperProvider } from "./ShoppingDeliveryShipperProvider";

export namespace ShoppingDeliveryProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_deliveriesGetPayload<ReturnType<typeof select>>,
    ): IShoppingDelivery => ({
      id: input.id,
      seller: ShoppingSellerProvider.invert.transform()(input.sellerCustomer),
      journeys: input.journeys
        .sort((a, b) =>
          a.created_at.getTime() === b.created_at.getTime()
            ? a.sequence - b.sequence
            : a.created_at.getTime() - b.created_at.getTime(),
        )
        .map(ShoppingDeliveryJourneyProvider.json.transform),
      shippers: input.shippers
        .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
        .map(ShoppingDeliveryShipperProvider.json.transform),
      pieces: input.pieces
        .sort((a, b) => a.sequence - b.sequence)
        .map(ShoppingDeliveryPieceProvider.json.transform),
      state: typia.assert<IShoppingDelivery.State>(
        input.mv_state?.value ?? "none",
      ),
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({
        include: {
          sellerCustomer: ShoppingSellerProvider.invert.select(),
          shippers: ShoppingDeliveryShipperProvider.json.select(),
          journeys: ShoppingDeliveryJourneyProvider.json.select(),
          pieces: ShoppingDeliveryPieceProvider.json.select(),
          mv_state: true,
        },
      }) satisfies Prisma.shopping_deliveriesFindManyArgs;
  }

  export namespace jsonFromPublish {
    export const transform = (
      input: Prisma.shopping_deliveriesGetPayload<ReturnType<typeof select>>,
    ): Omit<IShoppingDelivery, "pieces"> => ({
      id: input.id,
      seller: ShoppingSellerProvider.invert.transform()(input.sellerCustomer),
      journeys: input.journeys
        .sort((a, b) =>
          a.created_at.getTime() === b.created_at.getTime()
            ? a.sequence - b.sequence
            : a.created_at.getTime() - b.created_at.getTime(),
        )
        .map(ShoppingDeliveryJourneyProvider.json.transform),
      shippers: input.shippers
        .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
        .map(ShoppingDeliveryShipperProvider.json.transform),
      state: typia.assert<IShoppingDelivery.State>(
        input.mv_state?.value ?? "none",
      ),
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({
        include: {
          sellerCustomer: ShoppingSellerProvider.invert.select(),
          shippers: ShoppingDeliveryShipperProvider.json.select(),
          journeys: ShoppingDeliveryJourneyProvider.json.select(),
          mv_state: true,
        },
      }) satisfies Prisma.shopping_deliveriesFindManyArgs;
  }

  export namespace invert {
    export const transform = async (
      input: Prisma.shopping_deliveriesGetPayload<ReturnType<typeof select>>,
    ): Promise<IShoppingDelivery.IInvert> => ({
      ...(await ShoppingDeliveryPieceProvider.invert.transform(
        input.pieces.sort((a, b) => a.sequence - b.sequence),
      )),
      id: input.id,
      seller: ShoppingSellerProvider.invert.transform()(input.sellerCustomer),
      journeys: input.journeys
        .sort((a, b) =>
          a.created_at.getTime() === b.created_at.getTime()
            ? a.sequence - b.sequence
            : a.created_at.getTime() - b.created_at.getTime(),
        )
        .map(ShoppingDeliveryJourneyProvider.json.transform),
      shippers: input.shippers
        .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
        .map(ShoppingDeliveryShipperProvider.json.transform),
      state: typia.assert<IShoppingDelivery.State>(
        input.mv_state?.value ?? "none",
      ),
      created_at: input.created_at.toISOString(),
    });
    export const select = (actor: null | IShoppingActorEntity) =>
      ({
        include: {
          sellerCustomer: ShoppingSellerProvider.invert.select(),
          shippers: ShoppingDeliveryShipperProvider.json.select(),
          journeys: ShoppingDeliveryJourneyProvider.json.select(),
          pieces: ShoppingDeliveryPieceProvider.invert.select(actor),
          mv_state: true,
        },
      }) satisfies Prisma.shopping_deliveriesFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index = (props: {
    seller: IShoppingSeller.IInvert;
    input: IShoppingDelivery.IRequest;
  }): Promise<IPage<IShoppingDelivery.IInvert>> =>
    PaginationUtil.paginate({
      schema: ShoppingGlobal.prisma.shopping_deliveries,
      payload: invert.select(props.seller),
      transform: invert.transform,
    })({
      where: {
        sellerCustomer: {
          member: {
            of_seller: {
              id: props.seller.id,
            },
          },
        },
      },
      orderBy: props.input.sort?.length
        ? PaginationUtil.orderBy(orderBy)(props.input.sort)
        : [{ created_at: "desc" }],
    })(props.input);

  export const at = async (props: {
    seller: IShoppingSeller.IInvert;
    id: string;
  }): Promise<IShoppingDelivery.IInvert> => {
    const record =
      await ShoppingGlobal.prisma.shopping_deliveries.findFirstOrThrow({
        where: {
          id: props.id,
          sellerCustomer: {
            member: {
              of_seller: {
                id: props.seller.id,
              },
            },
          },
        },
        ...invert.select(props.seller),
      });
    return invert.transform(record);
  };

  export const find = async <
    Payload extends Prisma.shopping_deliveriesFindManyArgs,
  >(props: {
    payload: Payload;
    seller: IShoppingSeller.IInvert;
    id: string;
  }): Promise<Prisma.shopping_deliveriesGetPayload<Payload>> => {
    const record =
      await ShoppingGlobal.prisma.shopping_deliveries.findFirstOrThrow({
        ...props.payload,
        where: {
          id: props.id,
          sellerCustomer: {
            member: {
              of_seller: {
                id: props.seller.id,
              },
            },
          },
        },
      });
    return record as Prisma.shopping_deliveriesGetPayload<Payload>;
  };

  const orderBy = (
    _key: IShoppingDelivery.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    ({
      created_at: value,
    }) satisfies Prisma.shopping_deliveriesOrderByWithRelationInput;

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = async (props: {
    seller: IShoppingSeller.IInvert;
    input: IShoppingDelivery.ICreate;
  }): Promise<IShoppingDelivery> => {
    //----
    // VALIDATE
    //----
    const [publishList, incompletes] =
      await ShoppingDeliveryPieceProvider.getIncompletes({
        seller: props.seller,
        input: {
          publish_ids: [
            ...new Set(props.input.pieces.map((p) => p.publish_id)),
          ],
        },
      });
    const notFounds: IDiagnosis[] = [];
    const unprocessables: IDiagnosis[] = [];

    // MUST BE PAID
    publishList.forEach((publish) => {
      const access = () =>
        props.input.pieces
          .map((p, i) => [p.publish_id, i] as const)
          .filter(([publish_id]) => publish_id === publish.id);
      if (publish.paid_at === null)
        unprocessables.push(
          ...access().map(([_p_id, i]) => ({
            accessor: `pieces[${i}].publish_id`,
            message: `Target publish has not been paid yet.`,
          })),
        );
      else if (publish.cancelled_at !== null)
        unprocessables.push(
          ...access().map(([_p_id, i]) => ({
            accessor: `pieces[${i}].publish_id`,
            message: `Target publish has been cancelled.`,
          })),
        );
    });

    // VALIDATE ASSESSMENT
    props.input.pieces.forEach((piece, i) => {
      const publish = publishList.find((p) => p.id === piece.publish_id);
      if (publish === undefined)
        notFounds.push({
          accessor: `pieces[${i}].publish_id`,
          message: `Target publish does not exist.`,
        });
      else {
        const good = publish.order.goods.find((g) => g.id === piece.good_id);
        if (good === undefined)
          notFounds.push({
            accessor: `pieces[${i}].good_id`,
            message: `Target good does not exist.`,
          });
        else {
          const stock = good.commodity.stocks.find(
            (cs) => cs.shopping_sale_snapshot_unit_stock_id === piece.stock_id,
          );
          if (stock === undefined)
            unprocessables.push({
              accessor: `pieces[${i}].stock_id`,
              message: `Target stock does not exist.`,
            });
        }
      }
    });

    // CHECK DUPLICATED
    props.input.pieces.forEach((piece, i) => {
      const remained: IShoppingDeliveryPiece.ICreate | undefined =
        incompletes.find(
          (p) =>
            p.publish_id === piece.publish_id &&
            p.good_id === piece.good_id &&
            p.stock_id === piece.stock_id,
        );
      if (remained === undefined)
        unprocessables.push({
          accessor: `pieces[${i}]`,
          message: `Target piece has already been delivered.`,
        });
      else if (remained.quantity < piece.quantity)
        unprocessables.push({
          accessor: `pieces[${i}].quantity`,
          message: `Target piece's quantity is greater than remained.`,
        });
      else remained.quantity -= piece.quantity;
    });
    if (notFounds.length > 0) throw ErrorProvider.notFound(notFounds);
    else if (unprocessables.length > 0)
      throw ErrorProvider.unprocessable(unprocessables);

    //----
    // ARCHIVE
    //----
    const last: IShoppingDeliveryJourney.ICreate | undefined =
      props.input.journeys.at(-1);
    const state: IShoppingDelivery.State =
      last !== undefined
        ? last.type === "delivering" && last.completed_at !== null
          ? "arrived"
          : last.type
        : "none";

    const record = await ShoppingGlobal.prisma.shopping_deliveries.create({
      data: {
        id: v4(),
        shopping_seller_customer_id: props.seller.customer.id,
        created_at: new Date(),
        journeys: {
          create: props.input.journeys.map(
            ShoppingDeliveryJourneyProvider.collect,
          ),
        },
        pieces: {
          create: props.input.pieces.map(ShoppingDeliveryPieceProvider.collect),
        },
        mv_state: {
          create: {
            value: state,
          },
        },
      },
      ...json.select(),
    });

    const output: IShoppingDelivery = json.transform(record);
    await ShoppingDeliveryProvider.setState({
      root: false,
      incompletes: incompletes.filter((i) => i.quantity !== 0),
      delivery: record,
      pieces: output.pieces,
      state,
    });
    return output;
  };

  export const setState = async (props: {
    root: boolean;
    incompletes: IShoppingDeliveryPiece.ICreate[];
    delivery: IEntity;
    pieces: IShoppingDeliveryPiece[];
    state: IShoppingDelivery.State;
  }): Promise<void> => {
    // STATE OF DELIVERY
    if (props.root === true)
      await ShoppingGlobal.prisma.mv_shopping_delivery_states.update({
        where: {
          shopping_delivery_id: props.delivery.id,
        },
        data: {
          value: props.state,
        },
      });

    // STATES OF GOODS
    await ArrayUtil.asyncMap(
      [...new Set(props.pieces.map((p) => p.good_id))],
      (gid) =>
        setGoodState({
          delivery: props.delivery,
          good: { id: gid },
          incompletes: props.incompletes.filter((p) => p.good_id === gid),
          state: props.state,
        }),
    );

    // STATES OF SELLERS
    const goodTuples =
      await ShoppingGlobal.prisma.shopping_order_goods.findMany({
        select: {
          shopping_seller_id: true,
          order: {
            select: {
              publish: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
        where: {
          id: {
            in: [...new Set(props.pieces.map((p) => p.good_id))],
          },
        },
      });
    for (const gt of goodTuples)
      await setSellerState({
        publish: { id: gt.order.publish!.id },
        seller: { id: gt.shopping_seller_id },
      });

    // STATES OF PUBLISHES
    for (const pid of [...new Set(props.pieces.map((p) => p.publish_id))])
      await setPublishState({ id: pid });
  };

  const setGoodState = async (props: {
    delivery: IEntity;
    good: IEntity;
    incompletes: IShoppingDeliveryPiece.ICreate[];
    state: IShoppingDelivery.State;
  }): Promise<void> => {
    // PREPARE ARCHIVER
    const archive = async (value: IShoppingDelivery.State) => {
      await ShoppingGlobal.prisma.mv_shopping_order_good_states.update({
        where: {
          shopping_order_good_id: props.good.id,
        },
        data: {
          value,
        },
      });
    };

    // WHEN INCOMPLETE, STATE ALWAYS BE UNDERWAY
    if (props.incompletes.length)
      if (props.state !== "none") return archive("underway");
      else return archive("none");

    // COMPARE WITH NEIGHBOR STATES
    const neighbors =
      await ShoppingGlobal.prisma.mv_shopping_delivery_states.findMany({
        where: {
          delivery: {
            id: { not: props.delivery.id },
            pieces: {
              some: {
                shopping_order_good_id: props.good.id,
              },
            },
          },
        },
      });
    return archive(
      computeMinimumState([
        props.state,
        ...neighbors.map((n) => typia.assert<IShoppingDelivery.State>(n.value)),
      ]),
    );
  };

  const setSellerState = async (props: {
    publish: IEntity;
    seller: IEntity;
  }): Promise<void> => {
    const stateList: IShoppingDelivery.State[] = (
      await ShoppingGlobal.prisma.mv_shopping_order_good_states.findMany({
        where: {
          good: {
            order: {
              publish: {
                id: props.publish.id,
              },
            },
            shopping_seller_id: props.seller.id,
          },
        },
      })
    ).map((mv) => typia.assert<IShoppingDelivery.State>(mv.value));
    const value: IShoppingDelivery.State = computeMinimumState(stateList);

    await ShoppingGlobal.prisma.mv_shopping_order_publish_seller_states.update({
      where: {
        shopping_order_publish_id_shopping_seller_id: {
          shopping_order_publish_id: props.publish.id,
          shopping_seller_id: props.seller.id,
        },
      },
      data: {
        value,
      },
    });
  };

  const setPublishState = async (entity: IEntity): Promise<void> => {
    const stateList: IShoppingDelivery.State[] = (
      await ShoppingGlobal.prisma.mv_shopping_order_publish_seller_states.findMany(
        {
          where: {
            shopping_order_publish_id: entity.id,
          },
        },
      )
    ).map((mv) => typia.assert<IShoppingDelivery.State>(mv.value));
    const value: IShoppingDelivery.State = computeMinimumState(stateList);

    await ShoppingGlobal.prisma.mv_shopping_order_publish_states.update({
      where: {
        shopping_order_publish_id: entity.id,
      },
      data: {
        value,
      },
    });
  };

  const computeMinimumState = (stateList: IShoppingDelivery.State[]) => {
    if (stateList.length === 0) return "none";
    const minimum: IShoppingDelivery.State =
      STATES[Math.min(...stateList.map((elem) => STATES.indexOf(elem)))];
    return stateList.some((elem) => elem === "underway") ||
      (stateList.some((elem) => elem === "none") &&
        stateList.some((elem) => elem !== "none"))
      ? "underway"
      : minimum;
  };
}

const STATES: IShoppingDelivery.State[] =
  typia.misc.literals<IShoppingDelivery.State>();
