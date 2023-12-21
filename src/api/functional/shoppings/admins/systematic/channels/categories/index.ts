/**
 * @packageDocumentation
 * @module api.functional.shoppings.admins.systematic.channels.categories
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import type { IConnection, Primitive } from "@nestia/fetcher";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import type { IRecordMerge } from "../../../../../../structures/common/IRecordMerge";
import type { IShoppingChannelCategory } from "../../../../../../structures/shoppings/systematic/IShoppingChannelCategory";
import { NestiaSimulator } from "../../../../../../utils/NestiaSimulator";

/**
 * @controller ShoppingAdminSystematicChannelCategoriesController.create
 * @path POST /shoppings/admins/systematic/channels/:channelCode/categories
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function create(
    connection: IConnection,
    channelCode: string,
    input: create.Input,
): Promise<create.Output> {
    return !!connection.simulate
        ? create.simulate(
              connection,
              channelCode,
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
                  path: create.path(channelCode),
              } as const,
              input,
          );
}
export namespace create {
    export type Input = Primitive<IShoppingChannelCategory.ICreate>;
    export type Output = Primitive<IShoppingChannelCategory>;

    export const METADATA = {
        method: "POST",
        path: "/shoppings/admins/systematic/channels/:channelCode/categories",
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

    export const path = (channelCode: string): string => {
        return `/shoppings/admins/systematic/channels/${encodeURIComponent(channelCode ?? "null")}/categories`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IShoppingChannelCategory> =>
        typia.random<Primitive<IShoppingChannelCategory>>(g);
    export const simulate = async (
        connection: IConnection,
        channelCode: string,
        input: create.Input,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(channelCode),
            contentType: "application/json",
        });
        assert.param("channelCode")(() => typia.assert(channelCode));
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
 * @controller ShoppingAdminSystematicChannelCategoriesController.update
 * @path PUT /shoppings/admins/systematic/channels/:channelCode/categories/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function update(
    connection: IConnection,
    channelCode: string,
    id: string,
    input: update.Input,
): Promise<void> {
    return !!connection.simulate
        ? update.simulate(
              connection,
              channelCode,
              id,
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
                  ...update.METADATA,
                  path: update.path(channelCode, id),
              } as const,
              input,
          );
}
export namespace update {
    export type Input = Primitive<IShoppingChannelCategory.ICreate>;

    export const METADATA = {
        method: "PUT",
        path: "/shoppings/admins/systematic/channels/:channelCode/categories/:id",
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

    export const path = (channelCode: string, id: string): string => {
        return `/shoppings/admins/systematic/channels/${encodeURIComponent(channelCode ?? "null")}/categories/${encodeURIComponent(id ?? "null")}`;
    }
    export const simulate = async (
        connection: IConnection,
        channelCode: string,
        id: string,
        input: update.Input,
    ): Promise<void> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(channelCode, id),
            contentType: "application/json",
        });
        assert.param("channelCode")(() => typia.assert(channelCode));
        assert.param("id")(() => typia.assert(id));
        assert.body(() => typia.assert(input));
    }
}

/**
 * @controller ShoppingAdminSystematicChannelCategoriesController.merge
 * @path DELETE /shoppings/admins/systematic/channels/:channelCode/categories/merge
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function merge(
    connection: IConnection,
    channelCode: string,
    input: merge.Input,
): Promise<void> {
    return !!connection.simulate
        ? merge.simulate(
              connection,
              channelCode,
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
                  ...merge.METADATA,
                  path: merge.path(channelCode),
              } as const,
              input,
          );
}
export namespace merge {
    export type Input = Primitive<IRecordMerge>;

    export const METADATA = {
        method: "DELETE",
        path: "/shoppings/admins/systematic/channels/:channelCode/categories/merge",
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

    export const path = (channelCode: string): string => {
        return `/shoppings/admins/systematic/channels/${encodeURIComponent(channelCode ?? "null")}/categories/merge`;
    }
    export const simulate = async (
        connection: IConnection,
        channelCode: string,
        input: merge.Input,
    ): Promise<void> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(channelCode),
            contentType: "application/json",
        });
        assert.param("channelCode")(() => typia.assert(channelCode));
        assert.body(() => typia.assert(input));
    }
}

/**
 * @controller ShoppingAdminSystematicChannelCategoriesController.index
 * @path PATCH /shoppings/admins/systematic/channels/:channelCode/categories
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function index(
    connection: IConnection,
    channelCode: string,
): Promise<index.Output> {
    return !!connection.simulate
        ? index.simulate(
              connection,
              channelCode,
          )
        : PlainFetcher.fetch(
              connection,
              {
                  ...index.METADATA,
                  path: index.path(channelCode),
              } as const,
          );
}
export namespace index {
    export type Output = Primitive<Array<IShoppingChannelCategory.IHierarchical>>;

    export const METADATA = {
        method: "PATCH",
        path: "/shoppings/admins/systematic/channels/:channelCode/categories",
        request: null,
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (channelCode: string): string => {
        return `/shoppings/admins/systematic/channels/${encodeURIComponent(channelCode ?? "null")}/categories`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<Array<IShoppingChannelCategory.IHierarchical>> =>
        typia.random<Primitive<Array<IShoppingChannelCategory.IHierarchical>>>(g);
    export const simulate = async (
        connection: IConnection,
        channelCode: string,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(channelCode),
            contentType: "application/json",
        });
        assert.param("channelCode")(() => typia.assert(channelCode));
        return random(
            typeof connection.simulate === 'object' &&
                connection.simulate !== null
                ? connection.simulate
                : undefined
        );
    }
}

/**
 * @controller ShoppingAdminSystematicChannelCategoriesController.at
 * @path GET /shoppings/admins/systematic/channels/:channelCode/categories/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function at(
    connection: IConnection,
    channelCode: string,
    id: string & Format<"uuid">,
): Promise<at.Output> {
    return !!connection.simulate
        ? at.simulate(
              connection,
              channelCode,
              id,
          )
        : PlainFetcher.fetch(
              connection,
              {
                  ...at.METADATA,
                  path: at.path(channelCode, id),
              } as const,
          );
}
export namespace at {
    export type Output = Primitive<IShoppingChannelCategory>;

    export const METADATA = {
        method: "GET",
        path: "/shoppings/admins/systematic/channels/:channelCode/categories/:id",
        request: null,
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (channelCode: string, id: string & Format<"uuid">): string => {
        return `/shoppings/admins/systematic/channels/${encodeURIComponent(channelCode ?? "null")}/categories/${encodeURIComponent(id ?? "null")}`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IShoppingChannelCategory> =>
        typia.random<Primitive<IShoppingChannelCategory>>(g);
    export const simulate = async (
        connection: IConnection,
        channelCode: string,
        id: string & Format<"uuid">,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(channelCode, id),
            contentType: "application/json",
        });
        assert.param("channelCode")(() => typia.assert(channelCode));
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
 * @controller ShoppingAdminSystematicChannelCategoriesController.invert
 * @path GET /shoppings/admins/systematic/channels/:channelCode/categories/:id/invert
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function invert(
    connection: IConnection,
    channelCode: string,
    id: string & Format<"uuid">,
): Promise<invert.Output> {
    return !!connection.simulate
        ? invert.simulate(
              connection,
              channelCode,
              id,
          )
        : PlainFetcher.fetch(
              connection,
              {
                  ...invert.METADATA,
                  path: invert.path(channelCode, id),
              } as const,
          );
}
export namespace invert {
    export type Output = Primitive<IShoppingChannelCategory.IInvert>;

    export const METADATA = {
        method: "GET",
        path: "/shoppings/admins/systematic/channels/:channelCode/categories/:id/invert",
        request: null,
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (channelCode: string, id: string & Format<"uuid">): string => {
        return `/shoppings/admins/systematic/channels/${encodeURIComponent(channelCode ?? "null")}/categories/${encodeURIComponent(id ?? "null")}/invert`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IShoppingChannelCategory.IInvert> =>
        typia.random<Primitive<IShoppingChannelCategory.IInvert>>(g);
    export const simulate = async (
        connection: IConnection,
        channelCode: string,
        id: string & Format<"uuid">,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(channelCode, id),
            contentType: "application/json",
        });
        assert.param("channelCode")(() => typia.assert(channelCode));
        assert.param("id")(() => typia.assert(id));
        return random(
            typeof connection.simulate === 'object' &&
                connection.simulate !== null
                ? connection.simulate
                : undefined
        );
    }
}