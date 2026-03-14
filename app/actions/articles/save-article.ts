"use server";

import prisma from "@/lib/prisma";

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
    const existing = await prisma.article.findUnique({
      where: { url: articleData.url },
      select: { id: true, userId: true },
    });

    if (existing) {
      if (existing.userId === userId) {
        return {
          errorMessage: "この記事はすでに登録されています",
          success: false,
        };
      }
      // 別ユーザー登録分 → 現在のユーザーに紐づけ直す
      await prisma.article.update({
        where: { id: existing.id },
        data: {
          userId,
          title: articleData.title,
          siteName: articleData.siteName,
          description: articleData.description,
          siteUpdatedAt: articleData.siteUpdatedAt,
          thumbnail: articleData.thumbnail,
          content: articleData.content,
          updatedAt: new Date(),
        },
      });
      return { success: true };
    }

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