import { ForbiddenException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { ShoppingSellerDiagnoser } from "@samchon/shopping-api/lib/diagnosers/shoppings/actors/ShoppingSellerDiagnoser";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMember } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { JwtTokenService } from "../../../services/JwtTokenService";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { JwtTokenManager } from "../../../utils/JwtTokenManager";
import { ShoppingChannelProvider } from "../systematic/ShoppingChannelProvider";
import { ShoppingCitizenProvider } from "./ShoppingCitizenProvider";
import { ShoppingExternalUserProvider } from "./ShoppingExternalUserProvider";
import { ShoppingMemberEmailProvider } from "./ShoppingMemberEmailProvider";
import { ShoppingMemberProvider } from "./ShoppingMemberProvider";

export namespace ShoppingSellerProvider {
  /* -----------------------------------------------------------
    TRANSFOMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_sellersGetPayload<ReturnType<typeof select>>
    ): IShoppingSeller => ({
      id: input.id,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_sellersFindManyArgs;
  }
  export namespace invert {
    export const transform =
      (
        error: (message: string) => Error = () =>
          ErrorProvider.internal("exepcted to seller, but it isn't.")
      ) =>
      (
        customer: Prisma.shopping_customersGetPayload<ReturnType<typeof select>>
      ): IShoppingSeller.IInvert => {
        const member = customer.member;
        if (member === null) throw error("not a member.");

        const citizen = member.citizen;
        const seller = member.of_seller;

        if (citizen === null) throw error("not a citizen.");
        if (seller === null) throw error("not a seller.");

        return {
          id: seller.id,
          type: "seller",
          citizen: ShoppingCitizenProvider.json.transform(citizen),
          member: {
            id: member.id,
            emails: member.emails
              .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
              .map(ShoppingMemberEmailProvider.json.transform),
            nickname: member.nickname,
            created_at: member.created_at.toISOString(),
          },
          customer: {
            id: customer.id,
            channel: ShoppingChannelProvider.json.transform(customer.channel),
            external_user:
              customer.external_user !== null
                ? ShoppingExternalUserProvider.json.transform(
                    customer.external_user
                  )
                : null,
            href: customer.href,
            referrer: customer.referrer,
            ip: customer.ip,
            created_at: customer.created_at.toISOString(),
          },
          created_at: seller.created_at.toISOString(),
        };
      };
    export const select = () =>
      ({
        include: {
          channel: ShoppingChannelProvider.json.select(),
          external_user: ShoppingExternalUserProvider.json.select(),
          member: {
            include: {
              citizen: ShoppingCitizenProvider.json.select(),
              emails: ShoppingMemberEmailProvider.json.select(),
              of_seller: true,
            },
          },
        },
      }) satisfies Prisma.shopping_customersFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const authorize = async (request: {
    headers: {
      authorization?: string;
    };
  }): Promise<IShoppingSeller.IInvert> => {
    const asset: JwtTokenManager.IAsset = await JwtTokenService.authorize({
      table: "shopping_customers",
      request,
    });
    const customer = await ShoppingGlobal.prisma.shopping_customers.findFirst({
      where: { id: asset.id },
      ...invert.select(),
    });
    if (customer === null)
      throw ErrorProvider.forbidden({
        accessor: "headers.authorization",
        message: "tempered token",
      });
    return invert.transform((msg) => new ForbiddenException(`You're ${msg}`))(
      customer
    );
  };

  export const searchFromCustomer = (
    input: IShoppingSeller.IRequest.ISearch | undefined
  ) =>
    [
      ...(input?.id?.length
        ? [{ member: { of_seller: { id: input.id } } }]
        : []),
      ...ShoppingCitizenProvider.search(input).map((citizen) => ({ citizen })),
      ...(input?.email?.length
        ? [{ member: { emails: { some: { value: input.email } } } }]
        : []),
      ...(input?.nickname?.length
        ? [{ member: { nickname: input.nickname } }]
        : []),
    ] satisfies Prisma.shopping_customersWhereInput["AND"];

  export const orderBy = (
    key: IShoppingSeller.IRequest.SortableColumns,
    value: "asc" | "desc"
  ) =>
    (key === "seller.created_at"
      ? { created_at: value }
      : {
          created_at: value,
        }) satisfies Prisma.shopping_sellersOrderByWithRelationInput;

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const join =
    (customer: IShoppingCustomer) =>
    async (_input: IShoppingSeller.IJoin): Promise<IShoppingSeller.IInvert> => {
      if (customer.member === null)
        throw ErrorProvider.forbidden({
          accessor: "headers.Authorization",
          message: "You've not joined as a member yet.",
        });
      else if (customer.member.seller !== null)
        throw ErrorProvider.gone({
          accessor: "headers.Authorization",
          message: "You've already joined as a seller.",
        });
      else if (customer.member.citizen === null)
        throw ErrorProvider.forbidden({
          accessor: "headers.Authorization",
          message: "You've not activated as a citizen yet.",
        });

      const record = await ShoppingGlobal.prisma.shopping_sellers.create({
        data: {
          id: v4(),
          member: {
            connect: { id: customer.member.id },
          },
          created_at: new Date(),
        },
        ...json.select(),
      });
      return ShoppingSellerDiagnoser.invert({
        ...customer,
        member: {
          ...customer.member,
          seller: json.transform(record),
        },
      })!;
    };

  export const login = async (props: {
    customer: IShoppingCustomer;
    input: IShoppingMember.ILogin;
  }): Promise<IShoppingSeller.IInvert> => {
    props.customer = await ShoppingMemberProvider.login(props);
    if (!props.customer.member?.seller)
      throw ErrorProvider.forbidden({
        accessor: "headers.Authorization",
        message: "You've not joined as a seller yet.",
      });
    return ShoppingSellerDiagnoser.invert(props.customer)!;
  };
}
