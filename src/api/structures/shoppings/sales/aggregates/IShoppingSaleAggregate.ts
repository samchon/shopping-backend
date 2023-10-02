import { IShoppingSaleGoodAggregate } from "./IShoppingSaleGoodAggregate";
import { IShoppingSaleInquiryAggregate } from "./IShoppingSaleInquiryAggregate";
import { IShoppingSaleRefundAggregate } from "./IShoppingSaleRefundAggregate";

export interface IShoppingSaleAggregate {
    good: IShoppingSaleGoodAggregate;
    inquiry: IShoppingSaleInquiryAggregate;
    refund: IShoppingSaleRefundAggregate;
}
