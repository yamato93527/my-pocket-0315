"use client";

import { type MouseEvent, useState, useTransition } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toggleLike } from "../actions/articles/toggle-like";

type Props = {
  articleId: string;
  initialIsLiked: boolean;
};

function LikeButton({ articleId, initialIsLiked }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const next = !isLiked;
    // 画面を即座に更新（楽観的更新）
    setIsLiked(next);

    // サーバー側も後から更新
    startTransition(async () => {
      try {
        await toggleLike(articleId, next);
      } catch (error) {
        console.error(error);
        // エラー時は状態を元に戻す
        setIsLiked(!next);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isLiked}
      className={`transition-colors ${
        isLiked ? "text-red-500" : "text-gray-400"
      } ${isPending ? "opacity-60" : ""} relative z-30`}
    >
      {isLiked ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
}

export default LikeButton;

