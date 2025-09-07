import AppError from "../../errorHelpers/AppError";
import FilterData from "../../utils/filterData";
import httpStatus from "../../utils/httpStatus";
import { IUser, USER_ROLE } from "./user.interface";
import { User } from "./user.model";

const updateUser = async (userId: string, payload: Partial<IUser>) => {
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

const getAllUsers = async (query: Record<string, string>) => {
  const fields =
    query.fields &&
    query.fields
      ?.split(",")
      .filter((field) => field !== "password")
      .join(",");

  if (!query?.roles) {
    query.roles = { $ne: USER_ROLE.SUPER_ADMIN } as unknown as string;
  }

  const { data: FilteredUser, meta } = await FilterData({
    DocumentModel: User,
    query: { ...query, fields },
  });

  const users = await FilteredUser;

  return {
    data: users,
    meta,
  };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId);
  return user;
};

export const UserServices = {
  getAllUsers,
  updateUser,
  getMe,
};
