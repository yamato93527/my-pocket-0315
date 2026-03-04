import MobileLayout from "./components/MobileLayout";
import ArticleLists from "./components/ArticleLists";

export default async function Home() {
  return (
    <MobileLayout>
      <ArticleLists />
    </MobileLayout>
  );
}
