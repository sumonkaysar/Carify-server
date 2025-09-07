// import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import AppError from "../../errorHelpers/AppError";
import { generateOTP } from "../../utils/generateOTP";
import httpStatus from "../../utils/httpStatus";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";
import { OTP_EXPIRATION } from "./otp.const";

const sendOTP = async (email: string) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (isUserExist.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are already verified");
  }

  const OTP = generateOTP(6);
  const redisKey = `OTP:${email}`;

  await redisClient.set(redisKey, OTP, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  await sendEmail({
    to: email,
    subject: "OTP Code for verification",
    templateName: "OTP",
    templateData: {
      name: `${isUserExist.firstName} ${isUserExist.middleName} ${isUserExist.lastName}`,
      OTP,
    },
  });
};

const verifyOTP = async (email: string, OTP: string) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (isUserExist.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are already verified");
  }

  const redisKey = `OTP:${email}`;
  const savedOTP = await redisClient.get(redisKey);

  if (!savedOTP) {
    throw new AppError(httpStatus.BAD_REQUEST, "Expired OTP");
  }

  if (savedOTP !== OTP) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wrong OTP");
  }

  isUserExist.isVerified = true;

  await Promise.all([isUserExist.save(), redisClient.del([redisKey])]);
};

export const OTPServices = {
  sendOTP,
  verifyOTP,
};
