"use server";

import prisma from "@/lib/prisma";

export async function toggleLike(articleId: string, isLiked: boolean) {
  try {
    const userId = "temp-user-123";

    await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        isLiked,
        userId,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

