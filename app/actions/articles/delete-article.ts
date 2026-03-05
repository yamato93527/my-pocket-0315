"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteArticle(articleId: string) {
  try {
    await prisma.article.delete({
      where: {
        id: articleId,
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

