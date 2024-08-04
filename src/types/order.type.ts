export interface IProductArgs {
  id: number;
  qty: number;
  name: string;
}

export interface IOrderArgs {
  products: IProductArgs[];
  paymentMethod: PaymentMethodArgs;
  phoneNumber: number;
}

export enum PaymentMethodArgs {
  QRIS = "QRIS",
  DIGITAL_PAYMENT = "DIGITAL_PAYMENT",
}
