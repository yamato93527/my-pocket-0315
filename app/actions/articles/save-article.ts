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
}


export async function saveArticle(articleData: ArticleDataProps, userId: string) {
  return await prisma.article.create({
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
}