import AppError from "../errorHelpers/AppError";
import { IUser, USER_STATUS } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import httpStatus from "./httpStatus";

export const checkValidUser = (user: IUser) => {
  if (
    user.status === USER_STATUS.BLOCKED ||
    user.status === USER_STATUS.DELETED
  ) {
    throw new AppError(httpStatus.FORBIDDEN, `User is ${user.status}`);
  }

  if (!user.isVerified) {
    throw new AppError(httpStatus.NOT_VERIFIED, "User is not verified");
  }
};

export const checkUserExist = async (query: Record<string, string>) => {
  const isUserExist = await User.findOne(query);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  checkValidUser(isUserExist);

  return isUserExist;
};
