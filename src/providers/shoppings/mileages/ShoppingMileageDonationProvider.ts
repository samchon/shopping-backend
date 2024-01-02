import { InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
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
        () =>
          new InternalServerErrorException(
            "The donation has not been registered by administrator.",
          ),
      )(input.adminCustomer),
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
      } satisfies Prisma.shopping_mileage_donationsFindManyArgs);
  }

  export const index = (
    input: IShoppingMileageDonation.IRequest,
  ): Promise<IPage<IShoppingMileageDonation>> =>
    PaginationUtil.paginate({
      schema: ShoppingGlobal.prisma.shopping_mileage_donations,
      payload: json.select(),
      transform: json.transform,
    })({
      where: {
        AND: where(input.search),
      },
      orderBy: input.sort?.length
        ? PaginationUtil.orderBy(orderBy)(input.sort)
        : [{ created_at: "desc" }],
    })(input);

  const where = (
    input: IShoppingMileageDonation.IRequest.ISearch | undefined,
  ) =>
    [
      ...(input?.citizen !== undefined
        ? ShoppingCitizenProvider.search(input.citizen).map((citizen) => ({
            citizen,
          }))
        : []),
      ...(input?.minimum !== undefined
        ? [{ value: { gte: input.minimum } }]
        : []),
      ...(input?.maximum !== undefined
        ? [{ value: { lte: input.maximum } }]
        : []),
      ...(input?.from !== undefined
        ? [{ created_at: { gte: input.from } }]
        : []),
      ...(input?.to !== undefined ? [{ created_at: { lte: input.to } }] : []),
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

  export const at = async (id: string): Promise<IShoppingMileageDonation> => {
    const record =
      await ShoppingGlobal.prisma.shopping_mileage_donations.findFirstOrThrow({
        where: { id },
        ...json.select(),
      });
    return json.transform(record);
  };

  export const create =
    (administrator: IShoppingAdministrator.IInvert) =>
    async (input: IShoppingMileageDonation.ICreate) => {
      const citizen =
        await ShoppingGlobal.prisma.shopping_citizens.findFirstOrThrow({
          where: { id: input.citizen_id },
        });
      const record = await ShoppingMileageHistoryProvider.process(citizen)(
        "shopping_mileage_donation",
      )({
        task: () =>
          ShoppingGlobal.prisma.shopping_mileage_donations.create({
            data: collect(administrator)(input),
            ...json.select(),
          }),
        source: (entity) => entity,
        value: input.value,
      });
      return json.transform(record);
    };

  const collect =
    (administrator: IShoppingAdministrator.IInvert) =>
    (input: IShoppingMileageDonation.ICreate) =>
      ({
        id: v4(),
        adminCustomer: {
          connect: {
            id: administrator.customer.id,
          },
        },
        citizen: {
          connect: {
            id: input.citizen_id,
          },
        },
        value: input.value,
        reason: input.reason,
        created_at: new Date(),
      } satisfies Prisma.shopping_mileage_donationsCreateInput);
}
