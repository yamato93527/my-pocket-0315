import { registerArticle } from "../actions/articles/register-article";

function InputFormGroup() {
  return (
    <div className="flex gap-3 w-3/5 items-center relative">
      <div className="flex gap-3 items-center w-full">
        {/* インプットフォーム */}
        <form action={registerArticle} className="flex gap-3 flex-1">
          <input
            type="text"
            name="url"
            placeholder="例：https://example.com/article"
            required
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
    </div>
  );
}

export default InputFormGroup;
