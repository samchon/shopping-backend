import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IDiagnosis } from "@samchon/shopping-api/lib/structures/common/IDiagnosis";
import { IShoppingCitizen } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCitizen";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMember } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { BcryptUtil } from "../../../utils/BcryptUtil";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingAdministratorProvider } from "./ShoppingAdministratorProvider";
import { ShoppingCitizenProvider } from "./ShoppingCitizenProvider";
import { ShoppingMemberEmailProvider } from "./ShoppingMemberEmailProvider";
import { ShoppingSellerProvider } from "./ShoppingSellerProvider";

export namespace ShoppingMemberProvider {
  /* -----------------------------------------------------------
    TRANSFOMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_membersGetPayload<ReturnType<typeof select>>,
    ): IShoppingMember => ({
      id: input.id,
      citizen:
        input.citizen !== null
          ? ShoppingCitizenProvider.json.transform(input.citizen)
          : null,
      seller:
        input.of_seller !== null
          ? ShoppingSellerProvider.json.transform(input.of_seller)
          : null,
      administrator:
        input.of_admin !== null
          ? ShoppingAdministratorProvider.json.transform(input.of_admin)
          : null,
      emails: input.emails
        .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
        .map(ShoppingMemberEmailProvider.json.transform),
      nickname: input.nickname,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      Prisma.validator<Prisma.shopping_membersFindManyArgs>()({
        include: {
          citizen: ShoppingCitizenProvider.json.select(),
          of_seller: ShoppingSellerProvider.json.select(),
          of_admin: ShoppingAdministratorProvider.json.select(),
          emails: ShoppingMemberEmailProvider.json.select(),
        },
      });
  }

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const join =
    (customer: IShoppingCustomer) =>
    async (input: IShoppingMember.IJoin): Promise<IShoppingCustomer> => {
      // PRE-CONDITIONS
      if (customer.member !== null) throw ErrorProvider.gone("Already joined.");
      else if (
        customer.citizen !== null &&
        input.citizen !== null &&
        (input.citizen.mobile !== customer.citizen.mobile ||
          input.citizen.name !== customer.citizen.name)
      )
        throw ErrorProvider.conflict("Different citizen information.");
      input.citizen ??= customer.citizen;

      // INSPECT DUPLICATES
      const diagnoses: IDiagnosis[] = [];
      const inspect = (closure: () => IDiagnosis) => (count: number) => {
        if (count !== 0) diagnoses.push(closure());
      };
      inspect(() => ({
        accessor: "input.nickname",
        message: "Duplicated nicknam exists.",
      }))(
        await ShoppingGlobal.prisma.shopping_members.count({
          where: {
            shopping_channel_id: customer.channel.id,
            nickname: input.nickname,
          },
        }),
      );
      inspect(() => ({
        accessor: "input.email",
        message: "Duplicated email exists.",
      }))(
        await ShoppingGlobal.prisma.shopping_member_emails.count({
          where: {
            shopping_channel_id: customer.channel.id,
            value: input.email,
          },
        }),
      );
      inspect(() => ({
        accessor: "input.citizen.mobile",
        message: "Duplicated citizen exists.",
      }))(
        input.citizen === null
          ? 0
          : await ShoppingGlobal.prisma.shopping_citizens.count({
              where: {
                shopping_channel_id: customer.channel.id,
                mobile: input.citizen.mobile,
              },
            }),
      );
      if (diagnoses.length !== 0) throw ErrorProvider.conflict(diagnoses);

      // DO JOIN
      const record = await ShoppingGlobal.prisma.shopping_members.create({
        data: collect({
          customer,
          citizen:
            customer.citizen ??
            (input.citizen !== null
              ? await ShoppingCitizenProvider.create(customer.channel)(
                  input.citizen,
                )
              : null),
          password: await BcryptUtil.hash(input.password),
        })(input),
        ...json.select(),
      });
      return returnsWithSigning(customer)(json.transform(record));
    };

  export const login =
    (customer: IShoppingCustomer) =>
    async (input: IShoppingMember.ILogin): Promise<IShoppingCustomer> => {
      // TRY LOGIN
      const record = await ShoppingGlobal.prisma.shopping_members.findFirst({
        where: {
          shopping_channel_id: customer.channel.id,
          emails: {
            some: {
              value: input.email,
            },
          },
        },
        ...json.select(),
      });
      if (record === null)
        throw ErrorProvider.notFound({
          accessor: "input.email",
          message: "Unable to find the matched email.",
        });
      else if (
        false ===
        (await BcryptUtil.equals({
          input: input.password,
          hashed: record.password,
        }))
      )
        throw ErrorProvider.forbidden({
          accessor: "input.password",
          message: "Wrong password.",
        });

      // CONSIDER CITIZEN INFO
      const member: IShoppingMember = json.transform(record);
      if (
        customer.citizen !== null &&
        member.citizen !== null &&
        customer.citizen.id !== member.citizen.id
      )
        throw ErrorProvider.conflict(
          "Different citizen information with customer and member.",
        );
      else if (customer.citizen !== null && member.citizen === null)
        await ShoppingGlobal.prisma.shopping_members.update({
          where: { id: member.id },
          data: { citizen: { connect: { id: customer.citizen.id } } },
        });

      // RETURNS
      return returnsWithSigning(customer)(member);
    };

  const returnsWithSigning =
    (customer: IShoppingCustomer) =>
    async (member: IShoppingMember): Promise<IShoppingCustomer> => {
      if (customer.citizen === null && member.citizen !== null) {
        await ShoppingGlobal.prisma.shopping_customers.update({
          where: { id: customer.id },
          data: {
            citizen: { connect: { id: member.citizen.id } },
            member: { connect: { id: member.id } },
          },
        });
        if (customer.external_user !== null)
          await ShoppingGlobal.prisma.shopping_external_users.update({
            where: { id: customer.external_user.id },
            data: {
              citizen: { connect: { id: member.citizen.id } },
            },
          });
      } else
        await ShoppingGlobal.prisma.shopping_customers.update({
          where: { id: customer.id },
          data: { member: { connect: { id: member.id } } },
        });

      const citizen = customer.citizen ?? member.citizen;
      return {
        ...customer,
        external_user:
          customer.external_user !== null
            ? {
                ...customer.external_user,
                citizen,
              }
            : null,
        member: {
          ...member,
          citizen,
        },
        citizen,
      };
    };

  const collect =
    (props: {
      customer: IShoppingCustomer;
      citizen: IShoppingCitizen | null;
      password: string;
    }) =>
    (input: Omit<IShoppingMember.IJoin, "citizen" | "password">) =>
      Prisma.validator<Prisma.shopping_membersCreateInput>()({
        id: v4(),
        channel: {
          connect: { id: props.customer.channel.id },
        },
        citizen:
          props.citizen !== null
            ? {
                connect: { id: props.citizen.id },
              }
            : undefined,
        nickname: input.nickname,
        emails: {
          create: [
            {
              id: v4(),
              channel: {
                connect: { id: props.customer.channel.id },
              },
              value: input.email,
              created_at: new Date(),
            },
          ],
        },
        password: props.password,
        created_at: new Date(),
        updated_at: new Date(),
        withdrawn_at: null,
      });
}
