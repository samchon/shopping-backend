import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSaleInquiryComment } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryComment";

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
      actor;
      saleId;
      inquiryId;
      input;
      return null!;
    }

    @core.TypedRoute.Get(":id")
    public async at(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("inquiryId")
      inquiryId: string & tags.Format<"uuid">,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingSaleInquiryComment> {
      actor;
      saleId;
      inquiryId;
      id;
      return null!;
    }

    @core.TypedRoute.Post()
    public async create(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("inquiryId")
      inquiryId: string & tags.Format<"uuid">,
      @core.TypedBody() input: IShoppingSaleInquiryComment.ICreate,
    ): Promise<IShoppingSaleInquiryComment> {
      actor;
      saleId;
      inquiryId;
      input;
      return null!;
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
      actor;
      saleId;
      inquiryId;
      id;
      input;
      return null!;
    }

    @core.TypedRoute.Delete(":id")
    public async erase(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("inquiryId")
      inquiryId: string & tags.Format<"uuid">,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<void> {
      actor;
      saleId;
      inquiryId;
      id;
    }
  }
  return ShoppingSaleInquiryCommentsController;
}
