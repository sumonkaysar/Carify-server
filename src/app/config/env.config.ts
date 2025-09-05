import dotenv from "dotenv";
dotenv.config();

const envFields = [
  "NODE_ENV",
  "PORT",
  "DB_URL",
  "FRONTEND_URL",
  "BCRYPTJS_SALT_ROUND",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "JWT_REFRESH_SECRET",
  "JWT_REFRESH_EXPIRES_IN",
  "SUPER_ADMIN_EMAIL",
  "SUPER_ADMIN_PASS",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "SSL_STORE_ID",
  "SSL_STORE_PASS",
  "SSL_PAYEMNT_API",
  "SSL_VALIDATION_API",
  "SSL_IPN_URL",
  "SSL_SUCCESS_BACKEND_URL",
  "SSL_FAIL_BACKEND_URL",
  "SSL_CANCEL_BACKEND_URL",
  "SSL_SUCCESS_FRONTEND_URL",
  "SSL_FAIL_FRONTEND_URL",
  "SSL_CANCEL_FRONTEND_URL",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "COMPANY_NAME",
  "COMPANY_EMAIL",
  "COMPANY_PHONE",
] as const;

type IEnv = Record<(typeof envFields)[number], string>;

const env = {} as IEnv;
const missingEnvs: string[] = [];

envFields.forEach((key) => {
  const value = process.env[key];
  if (value) {
    env[key as keyof IEnv] = value;
  } else {
    missingEnvs.push(key);
  }
});

// Showing missing envs
const blue = (s: string) => `\x1b[34m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;

if (missingEnvs.length > 0) {
  const err =
    "\n================================\n" +
    yellow(" Missing") +
    " environment variables:" +
    "\n" +
    missingEnvs
      .map((k) => `    ${blue(k)}: ${yellow("undefined")}`)
      .join("\n") +
    "\n================================\n";
  throw new Error(err);
}

export default env;
