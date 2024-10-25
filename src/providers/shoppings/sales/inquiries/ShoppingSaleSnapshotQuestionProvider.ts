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
    export const transform = (props: {
      customer: IShoppingCustomer | null;
      input: Prisma.shopping_sale_snapshot_questionsGetPayload<
        ReturnType<typeof select>
      >;
    }): IShoppingSaleQuestion.ISummary => {
      const writer: IShoppingCustomer = ShoppingCustomerProvider.json.transform(
        props.input.base.customer
      );
      const visible: boolean =
        props.input.secret === false ||
        props.customer === null ||
        ShoppingCustomerProvider.equals(props.customer, writer);
      return {
        ...BbsArticleProvider.summarize.transform(props.input.base.base),
        customer: visible ? writer : ShoppingCustomerProvider.anonymous(writer),
        title: visible
          ? props.input.base.base.mv_last!.snapshot.title
          : "*".repeat(24),
        secret: props.input.secret,
        answer:
          props.input.base.answer !== null
            ? ShoppingSaleSnapshotInquiryAnswerProvider.summarize.transform(
                props.input.base.answer
              )
            : null,
        read_by_seller: props.input.base.read_by_seller_at !== null,
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
      }) satisfies Prisma.shopping_sale_snapshot_questionsFindManyArgs;
  }

  export namespace abridge {
    export const transform = (props: {
      customer: IShoppingCustomer | null;
      input: Prisma.shopping_sale_snapshot_questionsGetPayload<
        ReturnType<typeof select>
      >;
    }): IShoppingSaleQuestion.IAbridge => {
      const writer: IShoppingCustomer = ShoppingCustomerProvider.json.transform(
        props.input.base.customer
      );
      const visible: boolean =
        props.input.secret === false ||
        props.customer === null ||
        ShoppingCustomerProvider.equals(props.customer, writer);
      const base: IBbsArticle.IAbridge = BbsArticleProvider.abridge.transform(
        props.input.base.base
      );
      return {
        ...base,
        body: visible ? base.body : "*".repeat(24),
        customer:
          props.customer === null || visible
            ? ShoppingCustomerProvider.json.transform(props.input.base.customer)
            : ShoppingCustomerProvider.anonymous(props.customer),
        answer:
          props.input.base.answer !== null
            ? ShoppingSaleSnapshotInquiryAnswerProvider.abridge.transform(
                props.input.base.answer
              )
            : null,
        secret: props.input.secret,
        read_by_seller: props.input.base.read_by_seller_at !== null,
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
      }) satisfies Prisma.shopping_sale_snapshot_questionsFindManyArgs;
  }

  export namespace json {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_questionsGetPayload<
        ReturnType<typeof select>
      >
    ): IShoppingSaleQuestion => ({
      ...BbsArticleProvider.json.transform(input.base.base),
      customer: ShoppingCustomerProvider.json.transform(input.base.customer),
      answer:
        input.base.answer !== null
          ? ShoppingSaleSnapshotInquiryAnswerProvider.json.transform(
              input.base.answer
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
      }) satisfies Prisma.shopping_sale_snapshot_questionsFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index = async (props: {
    actor: IShoppingActorEntity;
    sale: IEntity;
    input: IShoppingSaleQuestion.IRequest;
  }): Promise<IPage<IShoppingSaleQuestion.ISummary>> => {
    if (props.actor.type === "seller")
      await ShoppingGlobal.prisma.shopping_sales.findFirstOrThrow({
        where: {
          id: props.sale.id,
          sellerCustomer: {
            member: {
              of_seller: {
                id: props.actor.id,
              },
            },
          },
        },
      });
    return PaginationUtil.paginate({
      schema: ShoppingGlobal.prisma.shopping_sale_snapshot_questions,
      payload: summarize.select(),
      transform: (v) =>
        summarize.transform({
          customer: props.actor.type === "customer" ? props.actor : null,
          input: v,
        }),
    })({
      where: {
        AND: [
          {
            base: {
              snapshot: {
                shopping_sale_id: props.sale.id,
              },
            },
          },
          ...search(props.input.search),
        ],
      },
      orderBy: props.input.sort?.length
        ? PaginationUtil.orderBy(orderBy)(props.input.sort)
        : [{ base: { base: { created_at: "desc" } } }],
    })(props.input);
  };

  export const abridges = async (props: {
    actor: IShoppingActorEntity;
    sale: IEntity;
    input: IShoppingSaleQuestion.IRequest;
  }): Promise<IPage<IShoppingSaleQuestion.IAbridge>> => {
    if (props.actor.type === "seller")
      await ShoppingGlobal.prisma.shopping_sales.findFirstOrThrow({
        where: {
          id: props.sale.id,
          sellerCustomer: {
            member: {
              of_seller: {
                id: props.actor.id,
              },
            },
          },
        },
      });
    return PaginationUtil.paginate({
      schema: ShoppingGlobal.prisma.shopping_sale_snapshot_questions,
      payload: abridge.select(),
      transform: (x) =>
        abridge.transform({
          customer: props.actor.type === "customer" ? props.actor : null,
          input: x,
        }),
    })({
      where: {
        AND: [
          {
            base: {
              snapshot: {
                shopping_sale_id: props.sale.id,
              },
            },
          },
          ...search(props.input.search),
        ],
      },
      orderBy: props.input.sort?.length
        ? PaginationUtil.orderBy(orderBy)(props.input.sort)
        : [{ base: { base: { created_at: "desc" } } }],
    })(props.input);
  };

  export const at = async (props: {
    actor: IShoppingActorEntity;
    sale: IEntity;
    id: string;
  }): Promise<IShoppingSaleQuestion> => {
    if (props.actor.type === "seller")
      await ShoppingGlobal.prisma.shopping_sales.findFirstOrThrow({
        where: {
          id: props.sale.id,
          sellerCustomer: {
            member: {
              of_seller: {
                id: props.actor.id,
              },
            },
          },
        },
      });
    const record =
      await ShoppingGlobal.prisma.shopping_sale_snapshot_questions.findFirstOrThrow(
        {
          where: {
            id: props.id,
          },
          ...json.select(),
        }
      );
    const output: IShoppingSaleQuestion = json.transform(record);
    if (
      output.secret === true &&
      props.actor.type === "customer" &&
      ShoppingCustomerProvider.equals(output.customer, props.actor) === false
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
    direction: "asc" | "desc"
  ) =>
    ({
      base: ShoppingSaleSnapshotInquiryProvider.orderBy(key, direction),
    }) satisfies Prisma.shopping_sale_snapshot_questionsOrderByWithRelationInput;

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = async (props: {
    customer: IShoppingCustomer;
    sale: IEntity;
    input: IShoppingSaleQuestion.ICreate;
  }): Promise<IShoppingSaleQuestion> => {
    const material =
      await ShoppingGlobal.prisma.mv_shopping_sale_last_snapshots.findFirstOrThrow(
        {
          where: {
            shopping_sale_id: props.sale.id,
          },
        }
      );
    const record =
      await ShoppingGlobal.prisma.shopping_sale_snapshot_questions.create({
        data: collect({
          customer: props.customer,
          snapshot: {
            id: material.shopping_sale_snapshot_id,
          },
          input: props.input,
        }),
        ...json.select(),
      });
    return json.transform(record);
  };

  export const update = async (props: {
    customer: IShoppingCustomer;
    sale: IEntity;
    id: string;
    input: IShoppingSaleQuestion.IUpdate;
  }): Promise<IShoppingSaleQuestion.ISnapshot> => {
    const question: IShoppingSaleQuestion = await at({
      actor: props.customer,
      sale: props.sale,
      id: props.id,
    });
    if (
      false ===
      ShoppingCustomerProvider.equals(props.customer, question.customer)
    )
      throw ErrorProvider.forbidden({
        accessor: "id",
        message: "This question is not yours.",
      });
    return BbsArticleSnapshotProvider.create(question)(props.input);
  };

  const collect = (props: {
    customer: IShoppingActorEntity;
    snapshot: IEntity;
    input: IShoppingSaleQuestion.ICreate;
  }) =>
    ({
      base: {
        create: {
          type: "question",
          base: {
            create: BbsArticleProvider.collect(
              BbsArticleSnapshotProvider.collect
            )(props.input),
          },
          customer: {
            connect: { id: props.customer.id },
          },
          snapshot: {
            connect: { id: props.snapshot.id },
          },
          read_by_seller_at: null,
          created_at: new Date(),
        },
      },
      secret: props.input.secret,
    }) satisfies Prisma.shopping_sale_snapshot_questionsCreateInput;
}
