import { Prisma } from "@prisma/client";

import { IBbsArticle } from "@samchon/shopping-api/lib/structures/common/IBbsArticle";
import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ShoppingGlobal } from "../../../../ShoppingGlobal";
import { ErrorProvider } from "../../../../utils/ErrorProvider";
import { PaginationUtil } from "../../../../utils/PaginationUtil";
import { BbsArticleProvider } from "../../../common/BbsArticleProvider";
import { BbsArticleSnapshotProvider } from "../../../common/BbsArticleSnapshotProvider";
import { ShoppingCustomerProvider } from "../../actors/ShoppingCustomerProvider";
import { ShoppingSaleSnapshotInquiryAnswerProvider } from "./ShoppingSaleSnapshotInquiryAnswerProvider";
import { ShoppingSaleSnapshotInquiryProvider } from "./ShoppingSaleSnapshotInquiryProvider";

export namespace ShoppingSaleQuestionProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace summarize {
    export const transform =
      (customer: IShoppingCustomer | null) =>
      (
        input: Prisma.shopping_sale_snapshot_questionsGetPayload<
          ReturnType<typeof select>
        >,
      ): IShoppingSaleQuestion.ISummary => {
        const writer: IShoppingCustomer =
          ShoppingCustomerProvider.json.transform(input.base.customer);
        const visible: boolean =
          input.secret === false ||
          customer === null ||
          ShoppingCustomerProvider.equals(customer)(writer);
        return {
          ...BbsArticleProvider.summarize.transform(input.base.base),
          customer: visible
            ? writer
            : ShoppingCustomerProvider.anonymous(writer),
          title: visible
            ? input.base.base.mv_last!.snapshot.title
            : "*".repeat(24),
          secret: input.secret,
          answer:
            input.base.answer !== null
              ? ShoppingSaleSnapshotInquiryAnswerProvider.summarize.transform(
                  input.base.answer,
                )
              : null,
          read_by_seller: input.base.read_by_seller_at !== null,
        };
      };
    export const select = () =>
      ({
        include: {
          base: {
            include: {
              base: BbsArticleProvider.summarize.select(),
              customer: ShoppingCustomerProvider.json.select(),
              answer:
                ShoppingSaleSnapshotInquiryAnswerProvider.summarize.select(),
            },
          },
        },
      } satisfies Prisma.shopping_sale_snapshot_questionsFindManyArgs);
  }

  export namespace abridge {
    export const transform =
      (customer: IShoppingCustomer | null) =>
      (
        input: Prisma.shopping_sale_snapshot_questionsGetPayload<
          ReturnType<typeof select>
        >,
      ): IShoppingSaleQuestion.IAbridge => {
        const writer: IShoppingCustomer =
          ShoppingCustomerProvider.json.transform(input.base.customer);
        const visible: boolean =
          input.secret === false ||
          customer === null ||
          ShoppingCustomerProvider.equals(customer)(writer);
        const base: IBbsArticle.IAbridge = BbsArticleProvider.abridge.transform(
          input.base.base,
        );
        return {
          ...base,
          body: visible ? base.body : "*".repeat(24),
          customer:
            customer === null || visible
              ? ShoppingCustomerProvider.json.transform(input.base.customer)
              : ShoppingCustomerProvider.anonymous(customer),
          answer:
            input.base.answer !== null
              ? ShoppingSaleSnapshotInquiryAnswerProvider.abridge.transform(
                  input.base.answer,
                )
              : null,
          secret: input.secret,
          read_by_seller: input.base.read_by_seller_at !== null,
        };
      };
    export const select = () =>
      ({
        include: {
          base: {
            include: {
              base: BbsArticleProvider.abridge.select(),
              customer: ShoppingCustomerProvider.json.select(),
              answer:
                ShoppingSaleSnapshotInquiryAnswerProvider.abridge.select(),
            },
          },
        },
      } satisfies Prisma.shopping_sale_snapshot_questionsFindManyArgs);
  }

  export namespace json {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_questionsGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingSaleQuestion => ({
      ...BbsArticleProvider.json.transform(input.base.base),
      customer: ShoppingCustomerProvider.json.transform(input.base.customer),
      answer:
        input.base.answer !== null
          ? ShoppingSaleSnapshotInquiryAnswerProvider.json.transform(
              input.base.answer,
            )
          : null,
      secret: input.secret,
      read_by_seller: input.base.read_by_seller_at !== null,
      type: "question",
    });
    export const select = () =>
      ({
        include: {
          base: {
            include: {
              base: BbsArticleProvider.json.select(),
              customer: ShoppingCustomerProvider.json.select(),
              answer: ShoppingSaleSnapshotInquiryAnswerProvider.json.select(),
            },
          },
        },
      } satisfies Prisma.shopping_sale_snapshot_questionsFindManyArgs);
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index =
    (actor: IShoppingActorEntity) =>
    (sale: IEntity) =>
    async (
      input: IShoppingSaleQuestion.IRequest,
    ): Promise<IPage<IShoppingSaleQuestion.ISummary>> => {
      if (actor.type === "seller")
        await ShoppingGlobal.prisma.shopping_sales.findFirstOrThrow({
          where: {
            id: sale.id,
            sellerCustomer: {
              member: {
                of_seller: {
                  id: actor.id,
                },
              },
            },
          },
        });
      return PaginationUtil.paginate({
        schema: ShoppingGlobal.prisma.shopping_sale_snapshot_questions,
        payload: summarize.select(),
        transform: summarize.transform(
          actor.type === "customer" ? actor : null,
        ),
      })({
        where: {
          AND: [
            {
              base: {
                snapshot: {
                  shopping_sale_id: sale.id,
                },
              },
            },
            ...search(input.search),
          ],
        },
        orderBy: input.sort?.length
          ? PaginationUtil.orderBy(orderBy)(input.sort)
          : [{ base: { base: { created_at: "desc" } } }],
      })(input);
    };

  export const abridges =
    (actor: IShoppingActorEntity) =>
    (sale: IEntity) =>
    async (
      input: IShoppingSaleQuestion.IRequest,
    ): Promise<IPage<IShoppingSaleQuestion.IAbridge>> => {
      if (actor.type === "seller")
        await ShoppingGlobal.prisma.shopping_sales.findFirstOrThrow({
          where: {
            id: sale.id,
            sellerCustomer: {
              member: {
                of_seller: {
                  id: actor.id,
                },
              },
            },
          },
        });
      return PaginationUtil.paginate({
        schema: ShoppingGlobal.prisma.shopping_sale_snapshot_questions,
        payload: abridge.select(),
        transform: abridge.transform(actor.type === "customer" ? actor : null),
      })({
        where: {
          AND: [
            {
              base: {
                snapshot: {
                  shopping_sale_id: sale.id,
                },
              },
            },
            ...search(input.search),
          ],
        },
        orderBy: input.sort?.length
          ? PaginationUtil.orderBy(orderBy)(input.sort)
          : [{ base: { base: { created_at: "desc" } } }],
      })(input);
    };

  export const at =
    (actor: IShoppingActorEntity) =>
    (sale: IEntity) =>
    async (id: string): Promise<IShoppingSaleQuestion> => {
      if (actor.type === "seller")
        await ShoppingGlobal.prisma.shopping_sales.findFirstOrThrow({
          where: {
            id: sale.id,
            sellerCustomer: {
              member: {
                of_seller: {
                  id: actor.id,
                },
              },
            },
          },
        });
      const record =
        await ShoppingGlobal.prisma.shopping_sale_snapshot_questions.findFirstOrThrow(
          {
            where: {
              id,
            },
            ...json.select(),
          },
        );
      const output: IShoppingSaleQuestion = json.transform(record);
      if (
        output.secret === true &&
        actor.type === "customer" &&
        ShoppingCustomerProvider.equals(output.customer)(actor) === false
      )
        throw ErrorProvider.forbidden({
          accessor: "id",
          message: "You are not allowed to access this secret question.",
        });
      return output;
    };

  const search = (input: IShoppingSaleQuestion.IRequest.ISearch | undefined) =>
    ShoppingSaleSnapshotInquiryProvider.search(input).map((base) => ({
      base,
    })) satisfies Prisma.shopping_sale_snapshot_questionsWhereInput["AND"];

  const orderBy = (
    key: IShoppingSaleQuestion.IRequest.SortableColumns,
    direction: "asc" | "desc",
  ) =>
    ({
      base: ShoppingSaleSnapshotInquiryProvider.orderBy(key, direction),
    } satisfies Prisma.shopping_sale_snapshot_questionsOrderByWithRelationInput);

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create =
    (customer: IShoppingCustomer) =>
    (sale: IEntity) =>
    async (
      input: IShoppingSaleQuestion.ICreate,
    ): Promise<IShoppingSaleQuestion> => {
      const material =
        await ShoppingGlobal.prisma.mv_shopping_sale_last_snapshots.findFirstOrThrow(
          {
            where: {
              shopping_sale_id: sale.id,
            },
          },
        );
      const record =
        await ShoppingGlobal.prisma.shopping_sale_snapshot_questions.create({
          data: collect(customer)({
            id: material.shopping_sale_snapshot_id,
          })(input),
          ...json.select(),
        });
      return json.transform(record);
    };

  export const update =
    (customer: IShoppingCustomer) =>
    (sale: IEntity) =>
    (id: string) =>
    async (
      input: IShoppingSaleQuestion.IUpdate,
    ): Promise<IShoppingSaleQuestion.ISnapshot> => {
      const question: IShoppingSaleQuestion = await at(customer)(sale)(id);
      if (
        false === ShoppingCustomerProvider.equals(customer)(question.customer)
      )
        throw ErrorProvider.forbidden({
          accessor: "id",
          message: "This question is not yours.",
        });
      return BbsArticleSnapshotProvider.create(question)(input);
    };

  const collect =
    (customer: IShoppingActorEntity) =>
    (snapshot: IEntity) =>
    (input: IShoppingSaleQuestion.ICreate) =>
      ({
        base: {
          create: {
            type: "question",
            base: {
              create: BbsArticleProvider.collect(
                BbsArticleSnapshotProvider.collect,
              )(input),
            },
            customer: {
              connect: { id: customer.id },
            },
            snapshot: {
              connect: { id: snapshot.id },
            },
            read_by_seller_at: null,
            created_at: new Date(),
          },
        },
        secret: input.secret,
      } satisfies Prisma.shopping_sale_snapshot_questionsCreateInput);
}
