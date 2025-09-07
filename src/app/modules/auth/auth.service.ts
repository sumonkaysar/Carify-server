import { compare } from "bcryptjs";
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
    "password"
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

export const AuthServices = {
  registerUser,
  credentialsLogin,
};
