import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSaleInquiryComment } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryComment";

import { ShoppingSaleSnapshotInquiryCommentProvider } from "../../../../providers/shoppings/sales/inquiries/ShoppinigSaleSnapshotInquiryCommentProvider";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSaleInquiryCommentsController<
  Actor extends IShoppingActorEntity,
>(type: "questions" | "reviews", props: IShoppingControllerProps) {
  @Controller(
    `shoppings/${props.path}/sales/:saleId/${type}/:inquiryId/comments`,
  )
  abstract class ShoppingSaleInquiryCommentsController {
    @core.TypedRoute.Patch()
    public async index(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("inquiryId")
      inquiryId: string & tags.Format<"uuid">,
      @core.TypedBody() input: IShoppingSaleInquiryComment.IRequest,
    ): Promise<IPage<IShoppingSaleInquiryComment>> {
      return ShoppingSaleSnapshotInquiryCommentProvider.index(actor)({
        sale: { id: saleId },
        inquiry: { id: inquiryId },
      })(input);
    }

    @core.TypedRoute.Get(":id")
    public async at(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("inquiryId")
      inquiryId: string & tags.Format<"uuid">,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingSaleInquiryComment> {
      return ShoppingSaleSnapshotInquiryCommentProvider.at(actor)({
        sale: { id: saleId },
        inquiry: { id: inquiryId },
      })(id);
    }

    @core.TypedRoute.Post()
    public async create(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("inquiryId")
      inquiryId: string & tags.Format<"uuid">,
      @core.TypedBody() input: IShoppingSaleInquiryComment.ICreate,
    ): Promise<IShoppingSaleInquiryComment> {
      return ShoppingSaleSnapshotInquiryCommentProvider.create(actor)({
        sale: { id: saleId },
        inquiry: { id: inquiryId },
      })(input);
    }

    @core.TypedRoute.Put(":id")
    public async update(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("inquiryId")
      inquiryId: string & tags.Format<"uuid">,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
      @core.TypedBody() input: IShoppingSaleInquiryComment.IUpdate,
    ): Promise<IShoppingSaleInquiryComment.ISnapshot> {
      return ShoppingSaleSnapshotInquiryCommentProvider.update(actor)({
        sale: { id: saleId },
        inquiry: { id: inquiryId },
      })(id)(input);
    }
  }
  return ShoppingSaleInquiryCommentsController;
}
