import { ArrayUtil, RandomGenerator } from "@nestia/e2e";
import { randint } from "tstl";

import { IBbsArticle } from "@samchon/shopping-api/lib/structures/common/IBbsArticle";

import { prepare_random_attachment_file } from "./prepare_random_attachment_file";

export const prepare_random_bbs_article = (
  input?: Partial<IBbsArticle.ICreate>,
): IBbsArticle.ICreate => ({
  format: "txt",
  title: RandomGenerator.paragraph()(),
  body: RandomGenerator.content()()(),
  files: ArrayUtil.repeat(randint(0, 3))(() =>
    prepare_random_attachment_file(),
  ),
  ...input,
});
