import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IDiagnosis } from "@samchon/shopping-api/lib/structures/common/IDiagnosis";
import { IShoppingCitizen } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCitizen";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingExternalUser } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingExternalUser";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { JwtTokenService } from "../../../services/JwtTokenService";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { JwtTokenManager } from "../../../utils/JwtTokenManager";
import { ShoppingChannelProvider } from "../systematic/ShoppingChannelProvider";
import { ShoppingCitizenProvider } from "./ShoppingCitizenProvider";
import { ShoppingExternalUserProvider } from "./ShoppingExternalUserProvider";
import { ShoppingMemberProvider } from "./ShoppingMemberProvider";

export namespace ShoppingCustomerProvider {
  /* -----------------------------------------------------------
    TRANSFOMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_customersGetPayload<ReturnType<typeof select>>,
    ): IShoppingCustomer => ({
      id: input.id,
      type: "customer",
      channel: ShoppingChannelProvider.json.transform(input.channel),
      citizen:
        input.citizen !== null
          ? ShoppingCitizenProvider.json.transform(input.citizen)
          : null,
      external_user:
        input.external_user !== null
          ? ShoppingExternalUserProvider.json.transform(input.external_user)
          : null,
      member:
        input.member !== null
          ? ShoppingMemberProvider.json.transform(input.member)
          : null,
      href: input.href,
      referrer: input.referrer,
      ip: input.ip,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({
        include: {
          channel: ShoppingChannelProvider.json.select(),
          citizen: ShoppingCitizenProvider.json.select(),
          external_user: ShoppingExternalUserProvider.json.select(),
          member: ShoppingMemberProvider.json.select(),
        },
      }) satisfies Prisma.shopping_customersFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const authorize =
    (level: "guest" | "member" | "citizen") =>
    async (request: {
      headers: {
        authorization?: string;
      };
    }): Promise<IShoppingCustomer> => {
      const asset: JwtTokenManager.IAsset =
        await JwtTokenService.authorize("shopping_customers")(request);
      const record = await ShoppingGlobal.prisma.shopping_customers.findFirst({
        ...json.select(),
        where: { id: asset.id },
      });
      if (record === null)
        throw ErrorProvider.forbidden({
          accessor: "headers.authorization",
          message: "tempered token",
        });

      const customer: IShoppingCustomer =
        ShoppingCustomerProvider.json.transform(record);
      if (level === "member" && customer.member === null)
        throw ErrorProvider.forbidden("You're not a member");
      if (level === "citizen" && customer.citizen === null)
        throw ErrorProvider.forbidden("You're not a citizen");
      return customer;
    };

  export const refresh = async (
    input?: string,
  ): Promise<IShoppingCustomer.IAuthorized> => {
    if (!input)
      throw ErrorProvider.unauthorized({
        accessor: "headers.Authorization",
        message: "No authorization token.",
      });
    else if (input.startsWith("Bearer "))
      input = input.substring("Bearer ".length);

    const decoded: JwtTokenManager.IAsset =
      await JwtTokenManager.verify("refresh")(input);
    if (decoded.table !== "shopping_customers")
      throw ErrorProvider.unauthorized({
        accessor: "headers.Authorization",
        message: "Invalid authorization token.",
      });

    const record =
      await ShoppingGlobal.prisma.shopping_customers.findFirstOrThrow({
        where: { id: decoded.id },
        ...json.select(),
      });
    return tokenize(json.transform(record));
  };

  export const at = async (id: string): Promise<IShoppingCustomer> => {
    const customer =
      await ShoppingGlobal.prisma.shopping_customers.findFirstOrThrow({
        ...json.select(),
        where: { id },
      });
    return json.transform(customer);
  };

  const tokenize = async (
    customer: IShoppingCustomer,
    readonly: boolean = false,
  ): Promise<IShoppingCustomer.IAuthorized> => {
    const token: JwtTokenManager.IOutput = await JwtTokenManager.generate({
      table: "shopping_customers",
      id: customer.id,
      readonly,
    });
    return {
      ...customer,
      token: {
        access: token.access,
        refresh: token.refresh,
        expired_at: token.expired_at,
        refreshable_until: token.refreshable_until,
      },
      setHeaders: {
        Authorization: "Bearer " + token.access,
      },
    };
  };

  export const where = (customer: IShoppingCustomer) =>
    ({
      OR: [
        {
          id: customer.id,
        },
        ...(customer.external_user
          ? [{ shopping_external_user_id: customer.external_user.id }]
          : []),
        ...(customer.member
          ? [{ shopping_member_id: customer.member.id }]
          : []),
        ...(customer.citizen
          ? [{ shopping_citizen_id: customer.citizen.id }]
          : []),
      ],
    }) satisfies Prisma.shopping_customersWhereInput;

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create =
    (request: { ip: string }) =>
    async (
      input: IShoppingCustomer.ICreate,
      readonly: boolean = false,
    ): Promise<IShoppingCustomer.IAuthorized> => {
      const channel = await ShoppingChannelProvider.get(input.channel_code);
      const external_user = input.external_user
        ? await ShoppingExternalUserProvider.create({
            channel,
            customer: null,
          })(input.external_user)
        : null;
      const record = await ShoppingGlobal.prisma.shopping_customers.create({
        data: await collect({ channel, external_user, request })(input),
        ...json.select(),
      });
      return tokenize(json.transform(record), readonly);
    };

  export const activate =
    (customer: IShoppingCustomer) =>
    async (input: IShoppingCitizen.ICreate): Promise<IShoppingCustomer> => {
      // VALIDATE CITIZZEN INFO
      const diagnoses: IDiagnosis[] = [];
      const inspect =
        (entity: string) => (target: IShoppingCitizen | null | undefined) => {
          if (target && target.mobile !== input.mobile)
            diagnoses.push({
              accessor: `input.citizen.mobile`,
              message: `Different citizen information with ${entity}.`,
            });
        };
      inspect("member")(customer.member?.citizen);
      inspect("external user")(customer.external_user?.citizen);

      // EMPLACE CITIZEN
      const citizen = await ShoppingCitizenProvider.create(customer.channel)(
        input,
      );
      await ShoppingGlobal.prisma.shopping_customers.update({
        where: { id: customer.id },
        data: {
          shopping_citizen_id: citizen.id,
        },
      });

      // UPDATE REFERENCES
      if (customer.member !== null && customer.member.citizen === null)
        await ShoppingGlobal.prisma.shopping_members.update({
          where: { id: customer.member.id },
          data: { citizen: { connect: { id: citizen.id } } },
        });
      if (
        customer.external_user !== null &&
        customer.external_user.citizen === null
      )
        await ShoppingGlobal.prisma.shopping_external_users.update({
          where: { id: customer.external_user.id },
          data: { citizen: { connect: { id: citizen.id } } },
        });

      // RETURNS WITH NEW TOKEN
      return {
        ...customer,
        member: customer.member ? { ...customer.member, citizen } : null,
        external_user: customer.external_user
          ? { ...customer.external_user, citizen }
          : null,
        citizen,
      };
    };

  const collect =
    (props: {
      channel: IShoppingChannel;
      external_user: IShoppingExternalUser | null;
      request: { ip: string };
    }) =>
    (input: IShoppingCustomer.ICreate) =>
      ({
        id: v4(),
        channel: { connect: { id: props.channel.id } },
        external_user:
          props.external_user !== null
            ? { connect: { id: props.external_user.id } }
            : undefined,
        citizen: props.external_user?.citizen?.id
          ? {
              connect: { id: props.external_user.citizen.id },
            }
          : undefined,
        member: undefined,
        href: input.href,
        referrer: input.referrer,
        ip: input.ip ?? props.request.ip,
        created_at: new Date(),
      }) satisfies Prisma.shopping_customersCreateInput;

  /* -----------------------------------------------------------
    PREDICATORS
  ----------------------------------------------------------- */
  export const anonymous = (
    customer: IShoppingCustomer,
  ): IShoppingCustomer => ({
    id: v4(),
    type: "customer",
    citizen: {
      id: v4(),
      mobile: "0".repeat(11),
      name: "*******",
      created_at: new Date().toISOString(),
    },
    external_user: null,
    member: null,
    channel: customer.channel,
    href: customer.href,
    referrer: customer.referrer,
    ip: customer.ip,
    created_at: new Date().toISOString(),
  });

  export const equals =
    (x: IShoppingCustomer) =>
    (y: IShoppingCustomer): boolean =>
      x.id === y.id ||
      (x.citizen !== null && x.citizen.id === y.citizen?.id) ||
      (x.external_user !== null &&
        x.external_user.id === y.external_user?.id) ||
      (x.member !== null && x.member.id === y.member?.id);
}
