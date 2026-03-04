"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { extractUrlData } from "./extract-url-data";
import { saveArticle } from "./save-article";

export type RegisterArticleState = { error?: string } | null;

export async function registerArticle(
  _prevState: RegisterArticleState,
  formData: FormData
): Promise<RegisterArticleState> {
  try {
    const rawUrl = formData.get("url");
    const url = typeof rawUrl === "string" ? rawUrl.trim() : "";

    if (!url) {
      return { error: "URLを入力してください" };
    }

    try {
      new URL(url);
    } catch {
      return { error: "正しいURL形式で入力してください" };
    }

    const articleData = await extractUrlData(url);

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

    const result = await saveArticle(articleData, user.id);
    if (!result.success) {
      return {
        error: result.errorMessage ?? "予期しないエラーが発生しました",
      };
    }
    revalidatePath("/");
    return null;
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : "記事の登録に失敗しました";
    return { error: message };
  }
}
