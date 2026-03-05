"use server";

import prisma from "@/lib/prisma";

export async function toggleArchive(articleId: string, isArchived: boolean) {
  try {
    const userId = "temp-user-123";

    await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        isArchived,
        userId,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

