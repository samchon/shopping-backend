import { IShoppingSaleContent } from "../../../structures/shoppings/sales/IShoppingSaleContent";

import { AttachmentFileDiagnoser } from "../../common/AttachmentFileDiagnoser";

export namespace ShoppingSaleContentDiagnoser {
  export const replica = (
    input: IShoppingSaleContent,
  ): IShoppingSaleContent.ICreate => ({
    title: input.title,
    body: input.body,
    format: input.format,
    thumbnails: input.thumbnails.map(AttachmentFileDiagnoser.replica),
    files: input.files.map(AttachmentFileDiagnoser.replica),
  });
}
