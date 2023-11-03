/**
 * @packageDocumentation
 * @module api.functional.shoppings.sellers.sales.snapshots
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import type { IConnection, Primitive } from "@nestia/fetcher";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import type { IPage } from "../../../../../structures/common/IPage";
import type { IShoppingSale } from "../../../../../structures/shoppings/sales/IShoppingSale";
import type { IShoppingSaleSnapshot } from "../../../../../structures/shoppings/sales/IShoppingSaleSnapshot";
import { NestiaSimulator } from "../../../../../utils/NestiaSimulator";

/**
 * @controller ShoppingSellerSaleSnapshotsController.index
 * @path PATCH /shoppings/sellers/sales/:saleId/snapshots
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function index(
    connection: IConnection,
    saleId: string & Format<"uuid">,
    input: index.Input,
): Promise<index.Output> {
    return !!connection.simulate
        ? index.simulate(
              connection,
              saleId,
              input,
          )
        : PlainFetcher.fetch(
              {
                  ...connection,
                  headers: {
                      ...(connection.headers ?? {}),
                      "Content-Type": "application/json",
                  },
              },
              {
                  ...index.METADATA,
                  path: index.path(saleId),
              } as const,
              input,
          );
}
export namespace index {
    export type Input = Primitive<IPage.IRequest>;
    export type Output = Primitive<IPage<IShoppingSaleSnapshot.ISummary>>;

    export const METADATA = {
        method: "PATCH",
        path: "/shoppings/sellers/sales/:saleId/snapshots",
        request: {
            type: "application/json",
            encrypted: false
        },
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (saleId: string & Format<"uuid">): string => {
        return `/shoppings/sellers/sales/${encodeURIComponent(saleId ?? "null")}/snapshots`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IPage<IShoppingSaleSnapshot.ISummary>> =>
        typia.random<Primitive<IPage<IShoppingSaleSnapshot.ISummary>>>(g);
    export const simulate = async (
        connection: IConnection,
        saleId: string & Format<"uuid">,
        input: index.Input,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(saleId),
            contentType: "application/json",
        });
        assert.param("saleId")(() => typia.assert(saleId));
        assert.body(() => typia.assert(input));
        return random(
            typeof connection.simulate === 'object' &&
                connection.simulate !== null
                ? connection.simulate
                : undefined
        );
    }
}

/**
 * @controller ShoppingSellerSaleSnapshotsController.at
 * @path GET /shoppings/sellers/sales/:saleId/snapshots/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function at(
    connection: IConnection,
    saleId: string & Format<"uuid">,
    id: string & Format<"uuid">,
): Promise<at.Output> {
    return !!connection.simulate
        ? at.simulate(
              connection,
              saleId,
              id,
          )
        : PlainFetcher.fetch(
              connection,
              {
                  ...at.METADATA,
                  path: at.path(saleId, id),
              } as const,
          );
}
export namespace at {
    export type Output = Primitive<IShoppingSaleSnapshot>;

    export const METADATA = {
        method: "GET",
        path: "/shoppings/sellers/sales/:saleId/snapshots/:id",
        request: null,
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (saleId: string & Format<"uuid">, id: string & Format<"uuid">): string => {
        return `/shoppings/sellers/sales/${encodeURIComponent(saleId ?? "null")}/snapshots/${encodeURIComponent(id ?? "null")}`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IShoppingSaleSnapshot> =>
        typia.random<Primitive<IShoppingSaleSnapshot>>(g);
    export const simulate = async (
        connection: IConnection,
        saleId: string & Format<"uuid">,
        id: string & Format<"uuid">,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(saleId, id),
            contentType: "application/json",
        });
        assert.param("saleId")(() => typia.assert(saleId));
        assert.param("id")(() => typia.assert(id));
        return random(
            typeof connection.simulate === 'object' &&
                connection.simulate !== null
                ? connection.simulate
                : undefined
        );
    }
}

/**
 * @controller ShoppingSellerSaleSnapshotsController.flip
 * @path GET /shoppings/sellers/sales/:saleId/snapshots/:id/flip
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function flip(
    connection: IConnection,
    saleId: string & Format<"uuid">,
    id: string & Format<"uuid">,
): Promise<flip.Output> {
    return !!connection.simulate
        ? flip.simulate(
              connection,
              saleId,
              id,
          )
        : PlainFetcher.fetch(
              connection,
              {
                  ...flip.METADATA,
                  path: flip.path(saleId, id),
              } as const,
          );
}
export namespace flip {
    export type Output = Primitive<IShoppingSale>;

    export const METADATA = {
        method: "GET",
        path: "/shoppings/sellers/sales/:saleId/snapshots/:id/flip",
        request: null,
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (saleId: string & Format<"uuid">, id: string & Format<"uuid">): string => {
        return `/shoppings/sellers/sales/${encodeURIComponent(saleId ?? "null")}/snapshots/${encodeURIComponent(id ?? "null")}/flip`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IShoppingSale> =>
        typia.random<Primitive<IShoppingSale>>(g);
    export const simulate = async (
        connection: IConnection,
        saleId: string & Format<"uuid">,
        id: string & Format<"uuid">,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(saleId, id),
            contentType: "application/json",
        });
        assert.param("saleId")(() => typia.assert(saleId));
        assert.param("id")(() => typia.assert(id));
        return random(
            typeof connection.simulate === 'object' &&
                connection.simulate !== null
                ? connection.simulate
                : undefined
        );
    }
}