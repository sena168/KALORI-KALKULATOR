import { readdir } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORY_LABELS = {
  "makanan-utama": "Makanan Utama",
  camilan: "Camilan",
  minuman: "Minuman",
};

const ADMIN_EMAILS = [
  "fransiscaroberta@gmail.com",
  "ashmeeishwar@gmail.com",
  "suhuac3ng@gmail.com",
  "senaprasena@gmail.com",
  "smpsantoyusupjalanjawa@gmail.com",
];

const parseFilename = (filename) => {
  const nameWithoutExt = filename.replace(/\.(png|jpg|jpeg)$/i, "");
  const lastDashIndex = nameWithoutExt.lastIndexOf("-");
  if (lastDashIndex === -1) return null;

  const namePart = nameWithoutExt.substring(0, lastDashIndex);
  const caloriesPart = nameWithoutExt.substring(lastDashIndex + 1);
  const calories = Number.parseInt(caloriesPart, 10);
  if (Number.isNaN(calories)) return null;

  const name = namePart
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""))
    .join(" ");

  return { name, calories, fileName: filename };
};

const seed = async () => {
  const repoRoot = process.cwd();
  const menuRoot = path.join(repoRoot, "public", "menu");

  await prisma.$transaction([
    prisma.menuOrder.deleteMany(),
    prisma.menuItem.deleteMany(),
    prisma.category.deleteMany(),
    prisma.adminUser.deleteMany(),
  ]);

  for (const [slug, label] of Object.entries(CATEGORY_LABELS)) {
    const categoryPath = path.join(menuRoot, slug);
    const files = await readdir(categoryPath);
    const items = files
      .filter((file) => /\.(png|jpg|jpeg)$/i.test(file))
      .map(parseFilename)
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));

    const category = await prisma.category.create({
      data: { slug, label },
    });

    const createdItems = [];
    for (const item of items) {
      const created = await prisma.menuItem.create({
        data: {
          name: item.name,
          calories: item.calories,
          imagePath: `/menu/${slug}/${item.fileName}`,
          categoryId: category.id,
        },
      });
      createdItems.push(created);
    }

    await prisma.menuOrder.createMany({
      data: createdItems.map((item, index) => ({
        categoryId: category.id,
        itemId: item.id,
        position: index,
      })),
    });
  }

  if (ADMIN_EMAILS.length > 0) {
    await prisma.adminUser.createMany({
      data: ADMIN_EMAILS.map((email) => ({ email, isActive: true })),
      skipDuplicates: true,
    });
  }
};

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
