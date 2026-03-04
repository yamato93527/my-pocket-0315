"use client";

import Image from "next/image";
import { useState } from "react";

function UserIcon() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="hidden lg:flex relative h-11/12 aspect-square items-center">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="relative h-10 md:h-14 w-10 md:w-14 rounded-full overflow-hidden border-2 border-gray-300 hover:border-gray-400 transition-colors"
      >
        <Image
          className="object-cover"
          src="/images/userIcon.png"
          fill={true}
          alt="ユーザーアイコン画像"
          sizes="80px"
        />
      </button>

      {/* ドロップダウンメニュー */}
      {isMenuOpen && (
        <div className="absolute right-0 top-5 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">ゆう</p>
            <p className="text-sm text-gray-500">sample@example.com</p>
          </div>
          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            ログアウト
          </button>
        </div>
      )}

      {/* メニューを閉じるためのオーバーレイ */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default UserIcon;
