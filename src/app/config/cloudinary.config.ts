/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import stream from "stream";
import AppError from "../errorHelpers/AppError";
import httpStatus from "../utils/httpStatus";
import env from "./env.config";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  fileName: string
): Promise<UploadApiResponse | undefined> => {
  try {
    return new Promise((resolve, reject) => {
      const public_id = `pdf/${fileName}-${Math.random()
        .toString(36)
        .substring(2)}-${Date.now()}`;
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            public_id,
            folder: "pdf",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        )
        .end(buffer);
    });
  } catch (error: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Error uploading file ${error.message}`
    );
  }
};

export const deleteFromCloudinary = async (url: string) => {
  try {
    const match = url.match(/\/([^/]+)\.[a-zA-Z0-9]+$/);

    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cloudinary image deletion failed",
      error.message
    );
  }
};

export default cloudinary;
