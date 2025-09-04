import AppError from "../../errorHelpers/AppError";
import httpStatus from "../../utils/httpStatus";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const updateUser = async (
  userId: string,
  payload: Partial<IUser>
  //   decoded: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

export const UserServices = {
  updateUser,
};
