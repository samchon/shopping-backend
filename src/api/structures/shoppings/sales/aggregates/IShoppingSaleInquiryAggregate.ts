export interface IShoppingSaleInquiryAggregate {
  question: IShoppingSaleInquiryAggregate.IQuestion;
  review: IShoppingSaleInquiryAggregate.IReview;
}
export namespace IShoppingSaleInquiryAggregate {
  export interface IQuestion {
    count: number;
    answer_count: number;
  }

  export interface IReview {
    count: number;
    answer_count: number;
    statistics: null | IStatistics;
    intervals: IInterval[];
  }

  export interface IStatistics {
    average: number;
    stdev: number;
  }

  export interface IInterval {
    score: number;
    count: number;
  }
}
