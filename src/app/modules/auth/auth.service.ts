import AppError from "../../errorHelpers/AppError";
import httpStatus from "../../utils/httpStatus";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const registerUser = async (payload: IUser) => {
  const isUserExist = await User.findOne({ email: payload.email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already registered");
  }

  const user = await User.create(payload);
  return user;
};

export const UserServices = {
  registerUser,
};
