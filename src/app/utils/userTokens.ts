import { JwtPayload } from "jsonwebtoken";
import envVars from "../config/env.config";
import { IUser } from "../modules/user/user.interface";
import { checkUserExist } from "./checkUserValidity";
import { generateToken, verifyToken } from "./jwt";

export const createUserTokens = async (user: IUser, needRefresh = true) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    roles: user.roles,
  };

  const tokens = {} as { accessToken: string; refreshToken: string };

  tokens.accessToken = generateToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRES_IN
  );

  if (needRefresh) {
    tokens.refreshToken = generateToken(
      jwtPayload,
      envVars.JWT_REFRESH_SECRET,
      envVars.JWT_REFRESH_EXPIRES_IN
    );
  }

  return tokens;
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await checkUserExist({
    email: verifiedRefreshToken.email,
  });

  const { accessToken } = await createUserTokens(isUserExist, false);

  return accessToken;
};
