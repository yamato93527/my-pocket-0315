"use client";

import { useEffect, useState } from "react";
import {
  registerArticle,
  type RegisterArticleState,
} from "../actions/articles/register-article";
import { redirect } from "next/navigation";
import FormMessage from "./FormMessage";
import ToggleSwitch from "./ToggleSwitch";
import { urlRegistrationSchema } from "@/lib/validations/urlRegistrationSchema";
import { searchKeywordRegistrationSchema } from "@/lib/validations/searchKeywordRegistrationSchema";

function InputFormGroup() {
  const [state, setState] = useState<RegisterArticleState>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  useEffect(() => {
    if (state?.error || error) {
      const timer = setTimeout(() => {
        setState(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state?.error, error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState(null);
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!isRegisterMode) {
      const keyword = formData.get("keyword") as string;
      const validationResult = searchKeywordRegistrationSchema.safeParse({
        keyword,
      });
      if (!validationResult.success) {
        const errorMessage = validationResult.error.issues
          .map((issue) => issue.message)
          .join(", ");
        setError(errorMessage);
        return;
      }
      const redirectUrl = `/?keyword=${encodeURIComponent(keyword)}`;
      redirect(redirectUrl);
      return;
    }

    const url = formData.get("url") as string;
    const validationResult = urlRegistrationSchema.safeParse({ url });
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues
        .map((issue) => issue.message)
        .join(", ");
      setState({ error: errorMessage });
      return;
    }

    try {
      const result = await registerArticle(null, formData);
      setState(result ?? null);
    } catch (err) {
      console.error(err);
      setState({
        error:
          err instanceof Error ? err.message : "記事の登録に失敗しました",
      });
    }
  };

  return (
    <div className="flex gap-3 w-3/5 items-center relative">
      <div className="flex gap-3 items-center w-full">
        {/* トグルスイッチ */}
        <ToggleSwitch
          isRegisterMode={isRegisterMode}
          setIsRegisterMode={setIsRegisterMode}
        />
        {/* インプットフォーム */}
        <form onSubmit={handleSubmit} className="flex gap-3 flex-1">
          <input
            type="text"
            name={isRegisterMode ? "url" : "keyword"}
            placeholder={
              isRegisterMode
                ? "例: https://example.com/article"
                : "タイトルやサイト名で検索"
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            className="hidden md:block w-28 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isRegisterMode ? "登録" : "検索"}
          </button>
        </form>
      </div>
      <FormMessage error={state?.error ?? error ?? undefined} />
    </div>
  );
}

export default InputFormGroup;
