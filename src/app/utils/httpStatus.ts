import httpStatusCodes from "http-status-codes";

const customStatusCodes = {
  NOT_VERIFIED: 499,
};

const httpStatus = { ...httpStatusCodes, ...customStatusCodes };

export default httpStatus;
