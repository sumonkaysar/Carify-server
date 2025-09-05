import { model, Schema } from "mongoose";
import { IOrder, ORDER_STATUS } from "./order.interface";

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    car: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Car",
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Booking = model<IOrder>("Booking", orderSchema);
