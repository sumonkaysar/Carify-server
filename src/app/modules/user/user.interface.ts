import { Types } from "mongoose";

/* eslint-disable no-unused-vars */
export enum USER_ROLE {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  SELLER = "SELLER",
}

export enum USER_STATUS {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: Types.ObjectId;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  avatar?: string;
  address?: string;
  roles: USER_ROLE[];
  isVerified: boolean;
  status: USER_STATUS;
}
