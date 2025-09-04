import { hash } from "bcryptjs";
import { model, Schema } from "mongoose";
import env from "../../config/env.config";
import { IUser, USER_ROLE, USER_STATUS } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
    },
    avatar: {
      type: String,
    },
    address: {
      type: String,
    },
    roles: {
      type: [String],
      enum: Object.values(USER_ROLE),
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, Number(env.BCRYPTJS_SALT_ROUND));
  }
  next();
});

userSchema.post("save", async function () {
  this.set("password", "", { strict: false });
});

export const User = model<IUser>("User", userSchema);
