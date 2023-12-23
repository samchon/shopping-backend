import { IAttachmentFile } from "../../structures/common/IAttachmentFile";

export namespace AttachmentFileDiagnoser {
  export const replica = (input: IAttachmentFile): IAttachmentFile.ICreate => ({
    name: input.name,
    extension: input.extension,
    url: input.url,
  });
}
