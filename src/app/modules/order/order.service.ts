import { startSession } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { createTransactionId } from "../../utils/createTransactionId";
import FilterData from "../../utils/filterData";
import httpStatus from "../../utils/httpStatus";
import { Car } from "../car/car.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ISslCommerz } from "../sslCommerz/sslCommerz.inteface";
import { SslServices } from "../sslCommerz/sslCommerz.service";
import { User } from "../user/user.model";
import { IOrder, ORDER_STATUS } from "./order.interface";
import { Order } from "./order.model";

const createOrder = async (payload: Partial<IOrder>, userId: string) => {
  const session = await startSession();

  const user = await User.findById(userId);

  if (!user?.phone || !user?.address) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please update your phone number and address to book a tour"
    );
  }
  const car = await Car.findById(payload.car).select("price");

  if (!car?.price) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour cost not found");
  }

  try {
    session.startTransaction();
    const order = await Order.create(
      [
        {
          user: userId,
          status: ORDER_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    const payment = await Payment.create(
      [
        {
          booking: order[0]._id,
          transactionId: createTransactionId(),
          amount: car?.price,
          status: PAYMENT_STATUS.UNPAID,
        },
      ],
      { session }
    );

    order[0].payment = payment[0]._id;
    await order[0].save({ session });

    const sslPayment = await SslServices.sslPaymentInit({
      name: `${user.firstName} ${user.middleName} ${user.lastName}`,
      address: user.address,
      email: user.email,
      phone: user.phone,
      transactionId: payment[0].transactionId,
      amount: payment[0].amount,
    } as ISslCommerz);

    const updatedBooking = await order[0].populate(
      "user car payment",
      "firstName middleName lastName email phone address title price transactionId amount status"
    );

    await session.commitTransaction();

    return {
      booking: updatedBooking,
      paymentUrl: sslPayment.GatewayPageURL,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getAllOrders = async (query: Record<string, string>) => {
  const { data: Filtered, meta } = await FilterData({
    DocumentModel: Order,
    query,
  });

  const orders = await Filtered.populate(
    "user",
    "firstName middleName lastName email phone role"
  )
    .populate("car")
    .populate("payment");

  return {
    data: orders,
    meta,
  };
};

const getMyOrders = async (userId: string, query: Record<string, string>) => {
  // const { data, meta } = await getAllTransactions();
  const { data: Filtered, meta } = await FilterData({
    DocumentModel: Order,
    query: {
      $or: [{ sender: userId }, { receiver: userId }],
      ...query,
    },
  });

  const orders = await Filtered.populate(
    "user",
    "firstName middleName lastName email phone role"
  )
    .populate("car")
    .populate("payment");

  return {
    data: orders,
    meta,
  };
};

const getSingleOrder = async (orderId: string) => {
  const order = await Order.findById(orderId);
  return order;
};

const updateOrder = async (orderId: string, payload: Partial<IOrder>) => {
  const isOrderExist = await Order.findById(orderId);

  if (!isOrderExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  const order = await Order.findByIdAndUpdate(orderId, payload, {
    new: true,
    runValidators: true,
  });
  return order;
};

export const OrderServices = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  updateOrder,
};
