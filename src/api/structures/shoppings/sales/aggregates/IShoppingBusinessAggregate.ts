import { IShoppingSaleGoodAggregate } from "./IShoppingOrderGoodAggregate";
import { IShoppingSaleRefundAggregate } from "./IShoppingOrderGoodRefundAggregate";
import { IShoppingSaleAggregate } from "./IShoppingSaleAggregate";
import { IShoppingSaleInquiryAggregate } from "./IShoppingSaleInquiryAggregate";

export interface IShoppingBusinessAggregate {
  sale: IShoppingSaleAggregate;
  inquiry: IShoppingSaleInquiryAggregate;
  good: IShoppingSaleGoodAggregate;
  refund: IShoppingSaleRefundAggregate;
}
