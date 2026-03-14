import { redirect } from "next/navigation";
import { auth } from "@/auth";
import MobileLayout from "../components/MobileLayout";
import ArticleLists from "../components/ArticleLists";

type SearchParams = Promise<{
  listtype?: string;
  keyword?: string;
}>;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const params = await searchParams;

  return (
    <MobileLayout>
      <ArticleLists params={params} />
    </MobileLayout>
  );
}
