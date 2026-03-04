import Image from "next/image";

function SidebarUserInfo() {
  return (
    <div className="p-4 border-t bg-white lg:hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-10 h-10 flex-shrink-0">
          <Image
            className="object-cover rounded-full"
            src="/images/userIcon.png"
            alt="ユーザーアイコン"
            fill={true}
            sizes="48px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-base truncate">ゆう</p>
          <p className="text-sm text-gray-500 truncate">sample@example.com</p>
        </div>
      </div>

      {/* ログアウトボタン */}
      <button className="w-full py-2 px-4 text-center text-base bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 rounded-md transition-colors">
        ログアウト
      </button>
    </div>
  );
}

export default SidebarUserInfo;
