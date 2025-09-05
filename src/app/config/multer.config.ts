import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    public_id: (_req, file) => {
      const fileNameArr = file.originalname.split(".");
      const fileName = fileNameArr
        .slice(0, -1)
        .join("-")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileName;

      return uniqueFileName;
    },
  },
});

export const multerUpload = multer({ storage });
