import { Request, Response } from "express";
import env from "../../config/env.config";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.initPayment(req.params.bookingId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "payment initialized succesfully",
    data: result,
  });
});

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.successPayment(
    req.query.transactionId as string
  );

  if (result?.success) {
    res.redirect(
      `${env.SSL_SUCCESS_FRONTEND_URL}?transactionId=${req.query.transactionId}&message=${result.message}&amount=${result.amount}`
    );
  }
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.cancelPayment(
    req.query.transactionId as string
  );

  if (!result?.success) {
    res.redirect(
      `${env.SSL_CANCEL_FRONTEND_URL}?transactionId=${req.query.transactionId}&message=${result.message}&amount=${result.amount}`
    );
  }
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.failPayment(
    req.query.transactionId as string
  );

  if (!result?.success) {
    res.redirect(
      `${env.SSL_FAIL_FRONTEND_URL}?transactionId=${req.query.transactionId}&message=${result.message}&amount=${result.amount}`
    );
  }
});

const getInvoiceUrl = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.getInvoiceUrl(req.params.paymentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invoice URL retrieved succesfully",
    data: result,
  });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  await PaymentServices.validatePayment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment validated succesfully",
    data: null,
  });
});

export const PaymentControllers = {
  initPayment,
  successPayment,
  cancelPayment,
  failPayment,
  getInvoiceUrl,
  validatePayment,
};
