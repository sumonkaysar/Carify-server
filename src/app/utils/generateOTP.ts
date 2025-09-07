export const generateOTP = (length = 6) => {
  const OTP = Math.floor(Math.random() * 10 ** length)
    .toString()
    .padStart(length, "0");

  return OTP;
};
