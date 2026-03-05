"use client";

import { type MouseEvent, useState, useTransition } from "react";
import { FaArchive } from "react-icons/fa";
import { toggleArchive } from "../actions/articles/toggle-archive";

type Props = {
  articleId: string;
  initialIsArchived: boolean;
};

function ArchiveButton({ articleId, initialIsArchived }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isArchived, setIsArchived] = useState(initialIsArchived);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const next = !isArchived;
    setIsArchived(next);

    startTransition(async () => {
      try {
        await toggleArchive(articleId, next);
      } catch (error) {
        console.error(error);
        setIsArchived(!next);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isArchived}
      className={`transition-colors ${
        isArchived ? "text-red-500" : "text-gray-400"
      } ${isPending ? "opacity-60" : ""} relative z-30`}
    >
      <FaArchive />
    </button>
  );
}

export default ArchiveButton;

