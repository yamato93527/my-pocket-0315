"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { extractUrlData } from "./extract-url-data";
import { saveArticle } from "./save-article";

export async function registerArticle(formData: FormData) {
  const rawUrl = formData.get("url");
  const url = typeof rawUrl === "string" ? rawUrl.trim() : "";

  if (!url) {
    throw new Error("URLを入力してください");
  }

  try {
    new URL(url);
  } catch {
    throw new Error("正しいURL形式で入力してください");
  }

  const articleData = await extractUrlData(url);

  const existingArticle = await prisma.article.findUnique({
    where: { url: articleData.url },
    select: { id: true },
  });

  if (existingArticle) {
    revalidatePath("/");
    return;
  }

  let user = await prisma.user.findFirst({
    select: { id: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Guest User",
      },
      select: { id: true },
    });
  }

  await saveArticle(articleData, user.id);
  revalidatePath("/");
}
