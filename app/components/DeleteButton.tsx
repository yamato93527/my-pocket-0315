"use client";

import { deleteArticle } from "../actions/articles/delete-article";
import { FaRegTrashCan } from "react-icons/fa6";

type Props = {
  articleId: string;
};

function DeleteButton({ articleId }: Props) {
  const deleteArticleWithId = deleteArticle.bind(null, articleId);

  return (
    <form
      action={deleteArticleWithId}
      onSubmit={(e) => {
        if (!confirm("この記事を削除しますか？")) {
          e.preventDefault();
        }
      }}
      className="inline-block"
    >
      <button
        type="submit"
        aria-label="この記事を削除"
        className="relative z-30 text-gray-400 hover:text-red-500 transition-colors"
      >
        <FaRegTrashCan />
      </button>
    </form>
  );
}

export default DeleteButton;

