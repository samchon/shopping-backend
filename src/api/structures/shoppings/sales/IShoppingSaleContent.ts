import { tags } from "typia";

import { IAttachmentFile } from "../../common/IAttachmentFile";

export interface IShoppingSaleContent {
    id: string & tags.Format<"uuid">;
    title: string;
    format: IShoppingSaleContent.Type;
    body: string;
    files: IAttachmentFile[];
}
export namespace IShoppingSaleContent {
    export type Type = "html" | "md" | "txt";

    export interface IInvert {
        id: string & tags.Format<"uuid">;
        title: string;
    }
    export type ISummary = IInvert;

    export interface IStore {
        title: string;
        format: IShoppingSaleContent.Type;
        body: string;
        files: IAttachmentFile.IStore[];
    }
}
