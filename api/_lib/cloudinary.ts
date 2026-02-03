import { v2 as cloudinary } from "cloudinary";

let configured = false;

const ensureConfigured = () => {
  if (configured) return;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary credentials.");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  configured = true;
};

export const uploadMenuImageIfNeeded = async (imagePath: string) => {
  if (!imagePath) return imagePath;
  if (!imagePath.startsWith("data:")) return imagePath;

  ensureConfigured();
  const result = await cloudinary.uploader.upload(imagePath, {
    folder: "menu",
    resource_type: "image",
  });
  return result.secure_url || result.url;
};
