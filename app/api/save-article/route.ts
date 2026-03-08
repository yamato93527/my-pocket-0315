import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractUrlData } from "@/app/actions/articles/extract-url-data";
import { saveArticle } from "@/app/actions/articles/save-article";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, userId: _userId } = body as { url?: string; userId?: string };

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { success: false, message: "URLを入力してください" },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, message: "正しいURL形式で入力してください" },
        { status: 400 }
      );
    }

    const articleData = await extractUrlData(url.trim());

    let user = await prisma.user.findFirst({
      select: { id: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { name: "Guest User" },
        select: { id: true },
      });
    }

    const result = await saveArticle(articleData, user.id);

    if (!result.success) {
      const errorMessage = result.errorMessage ?? "保存に失敗しました";
      return NextResponse.json(
        { success: false, message: errorMessage, error: errorMessage },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "データを受け取りました",
    });
  } catch (err) {
    console.error(err);
    const errorMessage =
      err instanceof Error ? err.message : "不明なエラーが発生しました";
    return NextResponse.json(
      { success: false, message: errorMessage, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
      