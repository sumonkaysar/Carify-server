/* eslint-disable no-console */
import envVars from "../config/env.config";
import { IUser, USER_ROLE, USER_STATUS } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("Super admin already exists!");
      return;
    }

    console.log("Trying to create super admin...");

    const payload: IUser = {
      firstName: "Super",
      lastName: "Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: envVars.SUPER_ADMIN_PASS,
      roles: [USER_ROLE.SUPER_ADMIN],
      status: USER_STATUS.ACTIVE,
      isVerified: true,
    };

    await User.create(payload);

    console.log("Super admin created successfully");
  } catch (error) {
    console.log(error);
  }
};

export default seedSuperAdmin;
