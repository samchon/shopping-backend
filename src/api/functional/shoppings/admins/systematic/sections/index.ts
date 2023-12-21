/**
 * @packageDocumentation
 * @module api.functional.shoppings.admins.systematic.sections
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import type { IConnection, Primitive } from "@nestia/fetcher";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import type { IPage } from "../../../../../structures/common/IPage";
import type { IRecordMerge } from "../../../../../structures/common/IRecordMerge";
import type { IShoppingSection } from "../../../../../structures/shoppings/systematic/IShoppingSection";
import { NestiaSimulator } from "../../../../../utils/NestiaSimulator";

/**
 * @controller ShoppingAdminSystematicSectionsController.create
 * @path POST /shoppings/admins/systematic/sections
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
    export type Input = Primitive<IShoppingSection.ICreate>;
    export type Output = Primitive<IShoppingSection>;

    export const METADATA = {
        method: "POST",
        path: "/shoppings/admins/systematic/sections",
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
        return `/shoppings/admins/systematic/sections`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IShoppingSection> =>
        typia.random<Primitive<IShoppingSection>>(g);
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

/**
 * @controller ShoppingAdminSystematicSectionsController.update
 * @path PUT /shoppings/admins/systematic/sections/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function update(
    connection: IConnection,
    id: string & Format<"uuid">,
    input: update.Input,
): Promise<void> {
    return !!connection.simulate
        ? update.simulate(
              connection,
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
                  path: update.path(id),
              } as const,
              input,
          );
}
export namespace update {
    export type Input = Primitive<IShoppingSection.IUpdate>;

    export const METADATA = {
        method: "PUT",
        path: "/shoppings/admins/systematic/sections/:id",
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

    export const path = (id: string & Format<"uuid">): string => {
        return `/shoppings/admins/systematic/sections/${encodeURIComponent(id ?? "null")}`;
    }
    export const simulate = async (
        connection: IConnection,
        id: string & Format<"uuid">,
        input: update.Input,
    ): Promise<void> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(id),
            contentType: "application/json",
        });
        assert.param("id")(() => typia.assert(id));
        assert.body(() => typia.assert(input));
    }
}

/**
 * @controller ShoppingAdminSystematicSectionsController.merge
 * @path DELETE /shoppings/admins/systematic/sections/merge
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function merge(
    connection: IConnection,
    input: merge.Input,
): Promise<void> {
    return !!connection.simulate
        ? merge.simulate(
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
                  ...merge.METADATA,
                  path: merge.path(),
              } as const,
              input,
          );
}
export namespace merge {
    export type Input = Primitive<IRecordMerge>;

    export const METADATA = {
        method: "DELETE",
        path: "/shoppings/admins/systematic/sections/merge",
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
        return `/shoppings/admins/systematic/sections/merge`;
    }
    export const simulate = async (
        connection: IConnection,
        input: merge.Input,
    ): Promise<void> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(),
            contentType: "application/json",
        });
        assert.body(() => typia.assert(input));
    }
}

/**
 * @controller ShoppingAdminSystematicSectionsController.index
 * @path PATCH /shoppings/admins/systematic/sections
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
    export type Input = Primitive<IShoppingSection.IRequest>;
    export type Output = Primitive<IPage<IShoppingSection>>;

    export const METADATA = {
        method: "PATCH",
        path: "/shoppings/admins/systematic/sections",
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
        return `/shoppings/admins/systematic/sections`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IPage<IShoppingSection>> =>
        typia.random<Primitive<IPage<IShoppingSection>>>(g);
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
 * @controller ShoppingAdminSystematicSectionsController.at
 * @path GET /shoppings/admins/systematic/sections/:id
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
    export type Output = Primitive<IShoppingSection>;

    export const METADATA = {
        method: "GET",
        path: "/shoppings/admins/systematic/sections/:id",
        request: null,
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (id: string & Format<"uuid">): string => {
        return `/shoppings/admins/systematic/sections/${encodeURIComponent(id ?? "null")}`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IShoppingSection> =>
        typia.random<Primitive<IShoppingSection>>(g);
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
 * @controller ShoppingAdminSystematicSectionsController.get
 * @path GET /shoppings/admins/systematic/sections/:code/get
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function get(
    connection: IConnection,
    code: string,
): Promise<get.Output> {
    return !!connection.simulate
        ? get.simulate(
              connection,
              code,
          )
        : PlainFetcher.fetch(
              connection,
              {
                  ...get.METADATA,
                  path: get.path(code),
              } as const,
          );
}
export namespace get {
    export type Output = Primitive<IShoppingSection>;

    export const METADATA = {
        method: "GET",
        path: "/shoppings/admins/systematic/sections/:code/get",
        request: null,
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (code: string): string => {
        return `/shoppings/admins/systematic/sections/${encodeURIComponent(code ?? "null")}/get`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IShoppingSection> =>
        typia.random<Primitive<IShoppingSection>>(g);
    export const simulate = async (
        connection: IConnection,
        code: string,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(code),
            contentType: "application/json",
        });
        assert.param("code")(() => typia.assert(code));
        return random(
            typeof connection.simulate === 'object' &&
                connection.simulate !== null
                ? connection.simulate
                : undefined
        );
    }
}