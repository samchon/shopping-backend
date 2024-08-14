import { IShoppingCouponTicket } from "../../../structures/shoppings/coupons/IShoppingCouponTicket";

export namespace ShoppingCouponTicketDiagnoser {
  export const unique = (
    tickets: IShoppingCouponTicket[],
  ): IShoppingCouponTicket[] => [
    ...new Map(tickets.map((t) => [t.coupon.id, t])).values(),
  ];
}
