import { IAttachmentFile } from "samchon/shopping-api/lib/structures/common/IAttachmentFile";
import { v4 } from "uuid";

import { Prisma } from ".prisma/client";

export namespace AttachmentFileProvider {
    export namespace json {
        export const transform = (
            input: Prisma.attachment_filesGetPayload<ReturnType<typeof select>>,
        ): IAttachmentFile => ({
            id: input.id,
            name: input.name,
            extension: input.extension,
            url: input.url,
            created_at: input.created_at.toISOString(),
        });
        export const select = () =>
            Prisma.validator<Prisma.attachment_filesFindManyArgs>()({});
    }

    export function collect(
        input: IAttachmentFile.IStore,
    ): Prisma.attachment_filesCreateInput {
        return {
            id: v4(),
            name: input.name,
            extension: input.extension,
            url: input.url,
            created_at: new Date(),
        };
    }
}
