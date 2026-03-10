import prisma from "@/lib/prisma";

/**
 * 現在のユーザーIDを取得する。
 * ユーザーが存在しなければ "Guest User" を作成してそのIDを返す。
 * 保存・取得で同じIDを使うことで一覧に記事が表示される。
 */
export async function getCurrentUserId(): Promise<string> {
  let user = await prisma.user.findFirst({
    select: { id: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { name: "Guest User" },
      select: { id: true },
    });
  }

  return user.id;
}
