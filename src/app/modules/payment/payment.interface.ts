/* eslint-disable no-unused-vars */
import { Types } from "mongoose";

export enum PAYMENT_STATUS {
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface IPayment {
  order: Types.ObjectId;
  transactionId: string;
  amount: number;
  paymentGatewayData?: unknown;
  invoiceUrl?: string;
  status: PAYMENT_STATUS;
}
