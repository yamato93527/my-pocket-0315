import React, { Dispatch, SetStateAction } from "react";

import Link from "next/link";
import SidebarUserInfo from "./SidebarUserInfo";

type SidebarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

function Sidebar({ isSidebarOpen}: SidebarProps) {
  return (
    <section
      className={`fixed lg:sticky top-16 lg:top-24 h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)] z-50 left-0 bg-white w-4/5 md:w-2/5 lg:w-1/5 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full translate3d(0,0,0)"
      } transform transition-transform will-change-transform duration-200 ease-out lg:translate-x-0 flex flex-col`}
    >
      {/* メインコンテンツエリア（スクロール対象） */}
      <div className="overflow-y-auto mb-10">
        <div className="pl-4 pt-4 lg:p-0">
          <h2 className="text-3xl lg:text-2xl font-bold mb-8">フィルター</h2>
          <ul className="flex flex-col gap-6 pl-4">
            <li>
              <Link
                href="#"
                className="flex items-center gap-3 text-xl"
              >
                すべて
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center gap-3 text-xl"
              >
                ホーム
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center gap-3 text-xl"
              >
                お気に入り
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center gap-3 text-xl"
              >
                アーカイブ
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* ユーザー情報エリア（固定） */}
      <SidebarUserInfo />
    </section>
  );
}

export default Sidebar;
