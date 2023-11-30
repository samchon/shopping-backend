import typia from "typia";

import ShoppingApi from "@samchon/shopping-api";
import { ISystem } from "@samchon/shopping-api/lib/structures/monitors/ISystem";

export const test_api_monitor_system = async (
    connection: ShoppingApi.IConnection,
): Promise<void> => {
    const system: ISystem = await ShoppingApi.functional.monitors.system.get(
        connection,
    );
    typia.assert(system);
};
