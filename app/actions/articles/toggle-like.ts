"use server";

import prisma from "@/lib/prisma";

export async function toggleLike(articleId: string, isLiked: boolean) {
  try {
    await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        isLiked,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

