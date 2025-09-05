import { startSession } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "../../utils/httpStatus";
import { ORDER_STATUS } from "../order/order.interface";
import { Order } from "../order/order.model";
import { SslServices } from "../sslCommerz/sslCommerz.service";
import { IUser } from "../user/user.interface";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const initPayment = async (orderId: string) => {
  const payment = await Payment.findOne({ order: orderId });

  if (!payment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment not found (You did not book the tour)."
    );
  }
  const car = await Order.findById(orderId).populate("user");
  const user = car?.user as unknown as IUser;

  const sslPayment = await SslServices.sslPaymentInit({
    name: `${user.firstName} ${user.middleName} ${user.lastName}`,
    address: user.address as string,
    email: user.email,
    phone: user.phone as string,
    transactionId: payment.transactionId,
    amount: payment.amount,
  });

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

const updatePaymentStatus = async (
  transactionId: string,
  paymentStatus: string,
  orderStatus: string
) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const payment = await Payment.findOneAndUpdate(
      { transactionId },
      { status: paymentStatus },
      { session, runValidators: true }
    );

    const order = await Order.findByIdAndUpdate(
      payment?.order,
      { status: orderStatus },
      { session, runValidators: true, new: true }
    )
      .populate("car", "title")
      .populate("user", "name email phone");

    await session.commitTransaction();

    return {
      amount: payment?.amount,
      order,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const successPayment = async (transactionId: string) => {
  const data = await updatePaymentStatus(
    transactionId,
    PAYMENT_STATUS.PAID,
    ORDER_STATUS.COMPLETED
  );

  // const user = data.order?.user as unknown as IUser;

  // const invoiceData = {
  //   companyName: env.COMPANY_NAME,
  //   companyEmail: env.COMPANY_EMAIL,
  //   companyPhone: env.COMPANY_PHONE,
  //   customerName: `${user.firstName} ${user.middleName} ${user.lastName}`,
  //   customerEmail: user.email,
  //   customerPhone: user.phone as string,
  //   tourTitle: (data.order?.car as unknown as ICar).title,
  //   orderDate: data.order?.createdAt as Date,
  //   totalAmount: data.amount as number,
  //   transactionId,
  // };

  // const pdfBuffer = await generateInvoice(invoiceData);

  // const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice");

  // if (!cloudinaryResult) {
  //   throw new AppError(
  //     httpStatus.INTERNAL_SERVER_ERROR,
  //     "Error on uploading pdf"
  //   );
  // }

  // await Payment.findByIdAndUpdate(
  //   data.order?.payment,
  //   { invoiceUrl: cloudinaryResult.secure_url },
  //   { runValidators: true }
  // );

  // await sendEmail({
  //   to: user.email,
  //   subject: "Your Booking Invoice",
  //   templateName: "invoice",
  //   templateData: invoiceData as unknown as Record<string, string>,
  //   attachments: [
  //     {
  //       filename: "invoice.pdf",
  //       content: pdfBuffer,
  //       contentType: "application/pdf",
  //     },
  //   ],
  // });

  return {
    success: true,
    amount: data.amount,
    message: "Payment completed succesfully",
  };
};

const cancelPayment = async (transactionId: string) => {
  const data = await updatePaymentStatus(
    transactionId,
    PAYMENT_STATUS.CANCELLED,
    ORDER_STATUS.CANCELLED
  );

  return {
    success: false,

    amount: data.amount,
    message: "Payment cancelled",
  };
};

const failPayment = async (transactionId: string) => {
  const data = await updatePaymentStatus(
    transactionId,
    PAYMENT_STATUS.FAILED,
    ORDER_STATUS.FAILED
  );

  return {
    success: false,
    amount: data.amount,
    message: "Payment failed",
  };
};

const getInvoiceUrl = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId).select("invoiceUrl");

  if (!payment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment not found (You did not order the car)."
    );
  }

  if (!payment?.invoiceUrl) {
    throw new AppError(httpStatus.BAD_REQUEST, "No invoice found");
  }

  return payment?.invoiceUrl;
};

const validatePayment = async (payload: {
  val_id: string;
  tran_id: string;
}) => {
  const paymentGatewayData = await SslServices.validatePayment(payload);

  await Payment.updateOne(
    { transactionId: payload.tran_id },
    { paymentGatewayData },
    { runValidators: true }
  );
};

export const PaymentServices = {
  initPayment,
  successPayment,
  cancelPayment,
  failPayment,
  getInvoiceUrl,
  validatePayment,
};
