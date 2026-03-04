"use client";

import { useEffect, useState } from "react";
import {
  registerArticle,
  type RegisterArticleState,
} from "../actions/articles/register-article";
import FormMessage from "./FormMessage";
import { urlRegistrationSchema } from "@/lib/validations/urlRegistrationSchema";

function InputFormGroup() {
  const [state, setState] = useState<RegisterArticleState>(null);

  useEffect(() => {
    if (state?.error) {
      const timer = setTimeout(() => setState(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [state?.error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
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
        {/* インプットフォーム */}
        <form onSubmit={handleSubmit} className="flex gap-3 flex-1">
          <input
            type="text"
            name="url"
            placeholder="例：https://example.com/article"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            className="hidden md:block w-28 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            登録
          </button>
        </form>
      </div>
      <FormMessage error={state?.error} />
    </div>
  );
}

export default InputFormGroup;
