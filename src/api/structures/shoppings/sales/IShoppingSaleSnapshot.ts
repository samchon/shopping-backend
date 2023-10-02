import { tags } from "typia";

import { IShoppingSeller } from "../actors/IShoppingSeller";
import { IShoppingSaleChannel } from "./IShoppingSaleChannel";
import { IShoppingSaleContent } from "./IShoppingSaleContent";
import { IShoppingSaleUnit } from "./IShoppingSaleUnit";
import { IShoppingSaleAggregate } from "./aggregates/IShoppingSaleAggregate";

export interface IShoppingSaleSnapshot {
    id: string & tags.Format<"uuid">;
    latest: boolean;
    created_at: string & tags.Format<"date-time">;

    content: IShoppingSaleContent;
    units: IShoppingSaleUnit[] & tags.MinItems<1>;
    aggregate: IShoppingSaleAggregate;
    tags: string[];
}
export namespace IShoppingSaleSnapshot {
    export interface IInvert {
        id: string & tags.Format<"uuid">;
        snapshot_id: string & tags.Format<"uuid">;
        latest: boolean;

        seller: IShoppingSeller;
        content: IShoppingSaleContent.IInvert;
        channels: IShoppingSaleChannel[];
        units: IShoppingSaleUnit.IInvert[] & tags.MinItems<1>;
    }

    export interface ISummary {
        id: string & tags.Format<"uuid">;
        snapshot_id: string & tags.Format<"uuid">;
        latest: boolean;

        content: IShoppingSaleContent.ISummary;
        channels: IShoppingSaleChannel[];
        units: IShoppingSaleUnit.ISummary[] & tags.MinItems<1>;
        aggregate: IShoppingSaleAggregate;
    }

    export interface IStore {
        content: IShoppingSaleContent.IStore;
        channels: IShoppingSaleChannel.IStore[];
        units: IShoppingSaleUnit.IStore[] & tags.MinItems<1>;
        tags: string[];
    }
}
