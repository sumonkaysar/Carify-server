import { compare } from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "../../utils/httpStatus";
import { createUserTokens } from "../../utils/userTokens";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const registerUser = async (payload: IUser) => {
  const isUserExist = await User.findOne({ email: payload.email });

  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "Email already registered");
  }

  const user = await User.create({ ...payload, roles: [payload.roles] });

  return user;
};

const credentialsLogin = async (payload: Partial<IUser>) => {
  const isUserExist = await User.findOne({ email: payload.email }).select(
    "+password"
  );

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Wrong credentials");
  }

  const isPasswordMatched = await compare(
    payload.password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.NOT_FOUND, "Wrong credentials");
  }

  const { accessToken, refreshToken } = await createUserTokens(isUserExist);

  return {
    user: isUserExist,
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  decoded: JwtPayload,
  newPassword: string,
  oldPassword: string
) => {
  const user = (await User.findById(decoded.userId).select(
    "+password"
  )) as Document & IUser;

  const isOldPasswordMatched = await compare(
    oldPassword,
    user.password as string
  );

  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password does not match");
  }
  user.password = newPassword;

  await user.save();
};

export const AuthServices = {
  registerUser,
  credentialsLogin,
  changePassword,
};
