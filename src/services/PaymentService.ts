export namespace PaymentService {
  export interface IProps {
    vendor: string;
    uid: string;
    orderId: string;
    amount: number;
  }
  export interface IOutput {
    created_at: Date;
    paid_at: null | Date;
    cancelled_at: null | Date;
  }

  export const enroll = async (props: IProps): Promise<IOutput> => {
    return {
      created_at: new Date(),
      paid_at: props.uid.includes("vbank") ? null : new Date(),
      cancelled_at: null,
    };
  };
}
