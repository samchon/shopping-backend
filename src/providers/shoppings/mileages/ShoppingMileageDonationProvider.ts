import { InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/sdk";
import { v4 } from "uuid";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingMileageDonation } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileageDonation";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { PaginationUtil } from "../../../utils/PaginationUtil";
import { ShoppingAdministratorProvider } from "../actors/ShoppingAdministratorProvider";
import { ShoppingCitizenProvider } from "../actors/ShoppingCitizenProvider";
import { ShoppingMileageHistoryProvider } from "./ShoppingMileageHistoryProvider";

export namespace ShoppingMileageDonationProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_mileage_donationsGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingMileageDonation => ({
      id: input.id,
      administrator: ShoppingAdministratorProvider.invert.transform(
        input.adminCustomer,
        () =>
          new InternalServerErrorException(
            "The donation has not been registered by administrator.",
          ),
      ),
      citizen: ShoppingCitizenProvider.json.transform(input.citizen),
      value: input.value,
      reason: input.reason,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({
        include: {
          adminCustomer: ShoppingAdministratorProvider.invert.select(),
          citizen: ShoppingCitizenProvider.json.select(),
        },
      }) satisfies Prisma.shopping_mileage_donationsFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index = async (props: {
    admin: IShoppingAdministrator.IInvert;
    input: IShoppingMileageDonation.IRequest;
  }): Promise<IPage<IShoppingMileageDonation>> =>
    PaginationUtil.paginate({
      schema: ShoppingGlobal.prisma.shopping_mileage_donations,
      payload: json.select(),
      transform: json.transform,
    })({
      where: {
        AND: where(props.input.search),
      },
      orderBy: props.input.sort?.length
        ? PaginationUtil.orderBy(orderBy)(props.input.sort)
        : [{ created_at: "desc" }],
    })(props.input);

  const where = (
    input: IShoppingMileageDonation.IRequest.ISearch | null | undefined,
  ) =>
    [
      ...(input?.citizen !== undefined && input?.citizen !== null
        ? ShoppingCitizenProvider.search(input.citizen).map((citizen) => ({
            citizen,
          }))
        : []),
      ...(input?.minimum !== undefined && input?.minimum !== null
        ? [{ value: { gte: input.minimum } }]
        : []),
      ...(input?.maximum !== undefined && input?.maximum !== null
        ? [{ value: { lte: input.maximum } }]
        : []),
      ...(input?.from !== undefined && input?.from !== null
        ? [{ created_at: { gte: input.from } }]
        : []),
      ...(input?.to !== undefined && input?.to !== null
        ? [{ created_at: { lte: input.to } }]
        : []),
    ] satisfies Prisma.shopping_mileage_donationsWhereInput["AND"];

  const orderBy = (
    key: IShoppingMileageDonation.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    (key === "donation.created_at"
      ? { created_at: value }
      : {
          value: value,
        }) satisfies Prisma.shopping_mileage_donationsOrderByWithRelationInput;

  export const at = async (props: {
    admin: IShoppingAdministrator.IInvert;
    id: string;
  }): Promise<IShoppingMileageDonation> => {
    const record =
      await ShoppingGlobal.prisma.shopping_mileage_donations.findFirstOrThrow({
        where: { id: props.id },
        ...json.select(),
      });
    return json.transform(record);
  };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = async (props: {
    admin: IShoppingAdministrator.IInvert;
    input: IShoppingMileageDonation.ICreate;
  }) => {
    const citizen =
      await ShoppingGlobal.prisma.shopping_citizens.findFirstOrThrow({
        where: { id: props.input.citizen_id },
      });
    const record = await ShoppingMileageHistoryProvider.process({
      citizen,
      mileage: {
        code: "shopping_mileage_donation",
      },
      task: () =>
        ShoppingGlobal.prisma.shopping_mileage_donations.create({
          data: collect(props),
          ...json.select(),
        }),
      source: (entity) => entity,
      value: () => props.input.value,
    });
    return json.transform(record);
  };

  const collect = (props: {
    admin: IShoppingAdministrator.IInvert;
    input: IShoppingMileageDonation.ICreate;
  }) =>
    ({
      id: v4(),
      adminCustomer: {
        connect: {
          id: props.admin.customer.id,
        },
      },
      citizen: {
        connect: {
          id: props.input.citizen_id,
        },
      },
      value: props.input.value,
      reason: props.input.reason,
      created_at: new Date(),
    }) satisfies Prisma.shopping_mileage_donationsCreateInput;
}
