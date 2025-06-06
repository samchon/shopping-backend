import { ForbiddenException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { ShoppingAdministratorDiagnoser } from "@samchon/shopping-api/lib/diagnosers/shoppings/actors/ShoppingAdministratorDiagnoser";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMember } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { JwtTokenService } from "../../../services/JwtTokenService";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { JwtTokenManager } from "../../../utils/JwtTokenManager";
import { ShoppingChannelProvider } from "../systematic/ShoppingChannelProvider";
import { ShoppingCitizenProvider } from "./ShoppingCitizenProvider";
import { ShoppingExternalUserProvider } from "./ShoppingExternalUserProvider";
import { ShoppingMemberEmailProvider } from "./ShoppingMemberEmailProvider";
import { ShoppingMemberProvider } from "./ShoppingMemberProvider";

export namespace ShoppingAdministratorProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_administratorsGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingAdministrator => ({
      id: input.id,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_administratorsFindManyArgs;
  }

  export namespace invert {
    export const transform = (
      customer: Prisma.shopping_customersGetPayload<ReturnType<typeof select>>,
      error: (message: string) => Error = () =>
        ErrorProvider.internal("expected to administrator, but it isn't."),
    ): IShoppingAdministrator.IInvert => {
      const member = customer.member;
      if (member === null) throw error("not a member.");

      const citizen = member.citizen;
      const administrator = member.of_admin;

      if (citizen === null) throw error("not a citizen.");
      if (administrator === null) throw error("not an administrator.");

      return {
        id: administrator.id,
        type: "administrator",
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
                  customer.external_user,
                )
              : null,
          href: customer.href,
          referrer: customer.referrer,
          ip: customer.ip,
          created_at: customer.created_at.toISOString(),
        },
        created_at: administrator.created_at.toISOString(),
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
              of_admin: true,
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
  }): Promise<IShoppingAdministrator.IInvert> => {
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
    return invert.transform(
      customer,
      (msg) => new ForbiddenException(`You're ${msg}`),
    );
  };

  /* -----------------------------------------------------------
      WRITERS
  ----------------------------------------------------------- */
  export const join = async (props: {
    customer: IShoppingCustomer;
    input: object; // not specified yet
  }): Promise<IShoppingAdministrator.IInvert> => {
    if (props.customer.member === null)
      throw ErrorProvider.forbidden({
        accessor: "headers.Authorization",
        message: "You've not joined as a member yet.",
      });
    else if (props.customer.member.administrator !== null)
      throw ErrorProvider.gone({
        accessor: "headers.Authorization",
        message: "You've already joined as an administrator.",
      });

    const record = await ShoppingGlobal.prisma.shopping_administrators.create({
      data: {
        id: v4(),
        member: {
          connect: { id: props.customer.member.id },
        },
        created_at: new Date(),
        deleted_at: null,
      },
      ...json.select(),
    });
    return ShoppingAdministratorDiagnoser.invert({
      ...props.customer,
      member: {
        ...props.customer.member,
        administrator: json.transform(record),
      },
    })!;
  };

  export const login = async (props: {
    customer: IShoppingCustomer;
    input: IShoppingMember.ILogin;
  }): Promise<IShoppingAdministrator.IInvert> => {
    props.customer = await ShoppingMemberProvider.login(props);
    if (!props.customer.member?.administrator)
      throw ErrorProvider.forbidden({
        accessor: "headers.Authorization",
        message: "You've not joined as an administrator yet.",
      });
    return ShoppingAdministratorDiagnoser.invert(props.customer)!;
  };
}
