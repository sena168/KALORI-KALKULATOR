import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("Missing Cloudinary env vars.");
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

const isCloudinaryUrl = (value) => typeof value === "string" && value.includes("res.cloudinary.com");

const toLocalPath = (imagePath) => {
  const relative = imagePath.replace(/^\/+/, "");
  return path.join(process.cwd(), "public", relative);
};

const toPublicId = (imagePath) => {
  const relative = imagePath.replace(/^\/+/, "");
  const withoutPrefix = relative.replace(/^menu\//, "");
  return withoutPrefix.replace(/\.[^/.]+$/, "");
};

const run = async () => {
  const items = await prisma.menuItem.findMany({
    select: { id: true, imagePath: true },
  });

  let updated = 0;
  let skipped = 0;
  let missing = 0;

  for (const item of items) {
    const { id, imagePath } = item;
    if (!imagePath || isCloudinaryUrl(imagePath) || imagePath.startsWith("data:")) {
      skipped += 1;
      continue;
    }
    if (!imagePath.startsWith("/menu/")) {
      skipped += 1;
      continue;
    }

    const localPath = toLocalPath(imagePath);
    if (!fs.existsSync(localPath)) {
      console.warn(`Missing file for ${id}: ${localPath}`);
      missing += 1;
      continue;
    }

    const upload = await cloudinary.uploader.upload(localPath, {
      folder: "menu",
      public_id: toPublicId(imagePath),
      resource_type: "image",
      overwrite: true,
    });

    await prisma.menuItem.update({
      where: { id },
      data: { imagePath: upload.secure_url || upload.url },
    });

    updated += 1;
  }

  console.log(`Done. Updated: ${updated}, skipped: ${skipped}, missing: ${missing}`);
};

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
