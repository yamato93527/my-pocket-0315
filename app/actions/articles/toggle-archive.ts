"use server";

import prisma from "@/lib/prisma";

export async function toggleArchive(articleId: string, isArchived: boolean) {
  try {
    await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        isArchived,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

