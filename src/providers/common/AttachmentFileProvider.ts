import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IAttachmentFile } from "@samchon/shopping-api/lib/structures/common/IAttachmentFile";

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
      ({}) satisfies Prisma.attachment_filesFindManyArgs;
  }

  export function collect(
    input: IAttachmentFile.ICreate,
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
