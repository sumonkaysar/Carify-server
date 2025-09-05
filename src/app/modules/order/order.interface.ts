/* eslint-disable no-unused-vars */
import { Types } from "mongoose";

export enum ORDER_STATUS {
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface IOrder {
  user: Types.ObjectId;
  car: Types.ObjectId;
  payment: Types.ObjectId;
  status: ORDER_STATUS;
  createdAt: Date;
}
