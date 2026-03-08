"use server";

import prisma from "@/lib/prisma";
import { checkUrlExists } from "./checkUrlExists";

type ArticleDataProps = {
  title: string;
  siteName: string;  // ※電球アイコン＝IDEの提案・警告
  description: string;
  siteUpdatedAt: string;
  thumbnail: string;
  url: string;
  content: string;
};

export type SaveArticleResult = {
  success: boolean;
  errorMessage?: string;
};

export async function saveArticle(
  articleData: ArticleDataProps,
  userId: string
): Promise<SaveArticleResult> {
  try {
    const isDuplicate = await checkUrlExists(articleData.url);
    if (isDuplicate) {
      console.log("URLが重複しています");
      return {
        errorMessage: "この記事はすでに登録されています",
        success: false,
      };
    }
    // データ保存
    await prisma.article.create({
      data: {
        userId,
        title: articleData.title,
        siteName: articleData.siteName,
        description: articleData.description,
        siteUpdatedAt: articleData.siteUpdatedAt,
        thumbnail: articleData.thumbnail,
        url: articleData.url,
        content: articleData.content,
      },
    });
    return {
      errorMessage: undefined,
      success: true,
    };
  } catch (err) {
    console.error(err);
    return {
      errorMessage: "記事の保存ができませんでした",
      success: false,
    };
  }
}