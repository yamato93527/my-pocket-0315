import MobileLayout from "./components/MobileLayout";
import ArticleLists from "./components/ArticleLists";

interface HomeProps {
  searchParams: Promise<{
    listtype?: string;
  }>;
}

export default async function Home(props: HomeProps) {
  const params = await props.searchParams;

  return (
    <MobileLayout>
      <ArticleLists params={params} />
    </MobileLayout>
  );
}
