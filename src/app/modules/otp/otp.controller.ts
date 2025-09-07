import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { OTPServices } from "./otp.service";

const sendOTP = catchAsync(async (req: Request, res: Response) => {
  await OTPServices.sendOTP(req.body.email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent succesfully",
    data: null,
  });
});

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  await OTPServices.verifyOTP(req.body.email, req.body.OTP);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP verified succesfully",
    data: null,
  });
});

export const OTPControllers = {
  sendOTP,
  verifyOTP,
};
