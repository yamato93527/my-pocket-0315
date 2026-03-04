import Image from "next/image";
import Link from "next/link";

function Logo() {
  return (
    <div className="h-full">
      <Link
        href="/"
        className="h-full flex items-center"
      >
        <div className="relative h-full aspect-square mr-1">
          <Image
            className="object-contain"
            src="/pocket-icon.png"
            alt="サイトロゴ"
            fill={true}
            sizes="80px"
          />
        </div>
        <h1 className="text-xl font-bold hidden md:block">my pocket</h1>
      </Link>
    </div>
  );
}

export default Logo;
