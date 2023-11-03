/**
 * @packageDocumentation
 * @module api.functional.shoppings.admins.mileages.donations
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import type { IConnection, Primitive } from "@nestia/fetcher";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import type { IPage } from "../../../../../structures/common/IPage";
import type { IShoppingMileageDonation } from "../../../../../structures/shoppings/mileages/IShoppingMileageDonation";
import { NestiaSimulator } from "../../../../../utils/NestiaSimulator";

/**
 * @controller ShoppingAdminMileageDonationsController.index
 * @path PATCH /shoppings/admins/mileages/donations
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function index(
    connection: IConnection,
    input: index.Input,
): Promise<index.Output> {
    return !!connection.simulate
        ? index.simulate(
              connection,
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
                  path: index.path(),
              } as const,
              input,
          );
}
export namespace index {
    export type Input = Primitive<IShoppingMileageDonation.IRequest>;
    export type Output = Primitive<IPage<IShoppingMileageDonation>>;

    export const METADATA = {
        method: "PATCH",
        path: "/shoppings/admins/mileages/donations",
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

    export const path = (): string => {
        return `/shoppings/admins/mileages/donations`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IPage<IShoppingMileageDonation>> =>
        typia.random<Primitive<IPage<IShoppingMileageDonation>>>(g);
    export const simulate = async (
        connection: IConnection,
        input: index.Input,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(),
            contentType: "application/json",
        });
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
 * @controller ShoppingAdminMileageDonationsController.at
 * @path GET /shoppings/admins/mileages/donations/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function at(
    connection: IConnection,
    id: string & Format<"uuid">,
): Promise<at.Output> {
    return !!connection.simulate
        ? at.simulate(
              connection,
              id,
          )
        : PlainFetcher.fetch(
              connection,
              {
                  ...at.METADATA,
                  path: at.path(id),
              } as const,
          );
}
export namespace at {
    export type Output = Primitive<IShoppingMileageDonation>;

    export const METADATA = {
        method: "GET",
        path: "/shoppings/admins/mileages/donations/:id",
        request: null,
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (id: string & Format<"uuid">): string => {
        return `/shoppings/admins/mileages/donations/${encodeURIComponent(id ?? "null")}`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IShoppingMileageDonation> =>
        typia.random<Primitive<IShoppingMileageDonation>>(g);
    export const simulate = async (
        connection: IConnection,
        id: string & Format<"uuid">,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(id),
            contentType: "application/json",
        });
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
 * @controller ShoppingAdminMileageDonationsController.create
 * @path POST /shoppings/admins/mileages/donations
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function create(
    connection: IConnection,
    input: create.Input,
): Promise<create.Output> {
    return !!connection.simulate
        ? create.simulate(
              connection,
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
                  ...create.METADATA,
                  path: create.path(),
              } as const,
              input,
          );
}
export namespace create {
    export type Input = Primitive<IShoppingMileageDonation.ICreate>;
    export type Output = Primitive<IShoppingMileageDonation>;

    export const METADATA = {
        method: "POST",
        path: "/shoppings/admins/mileages/donations",
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

    export const path = (): string => {
        return `/shoppings/admins/mileages/donations`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IShoppingMileageDonation> =>
        typia.random<Primitive<IShoppingMileageDonation>>(g);
    export const simulate = async (
        connection: IConnection,
        input: create.Input,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(),
            contentType: "application/json",
        });
        assert.body(() => typia.assert(input));
        return random(
            typeof connection.simulate === 'object' &&
                connection.simulate !== null
                ? connection.simulate
                : undefined
        );
    }
}