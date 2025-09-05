/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import env from "../../config/env.config";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "../../utils/httpStatus";
import { ISslCommerz } from "./sslCommerz.inteface";

const sslPaymentInit = async (payload: ISslCommerz) => {
  try {
    const data = {
      store_id: env.SSL_STORE_ID,
      store_passwd: env.SSL_STORE_PASS,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      success_url: `${env.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}`,
      fail_url: `${env.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}`,
      cancel_url: `${env.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}`,
      // ipn_url: env.SSL_IPN_URL,
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: payload.phone,
      cus_fax: "01xxxxxxxxx",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: "1000",
      ship_country: "N/A",
    };

    const res = await axios({
      method: "POST",
      url: env.SSL_PAYEMNT_API,
      data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return res.data;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const validatePayment = async (payload: { val_id: string }) => {
  try {
    const res = await axios({
      method: "GET",
      url: `${env.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${env.SSL_STORE_ID}&store_passwd=${env.SSL_STORE_PASS}`,
    });

    return res.data;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

export const SslServices = {
  sslPaymentInit,
  validatePayment,
};
