import { tags } from "typia";

import { IShoppingPrice } from "../base/IShoppingPrice";
import { IShoppingCouponTicketPayment } from "../coupons/IShoppingCouponTicketPayment";

export interface IShoppingOrderPrice extends IShoppingOrderPrice.ISummary {
    ticket_payments: IShoppingCouponTicketPayment[];
}
export namespace IShoppingOrderPrice {
    export interface ISummary extends IShoppingPrice {
        cash: number & tags.Minimum<0>;
        deposit: number & tags.Minimum<0>;
        mileage: number & tags.Minimum<0>;
        ticket: number & tags.Minimum<0>;
    }
}
