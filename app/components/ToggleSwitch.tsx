function ToggleSwitch() {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <span className="text-sm text-gray-600 hidden md:block">URL登録</span>
      <button
        type="button"
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gray-300"
      >
        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
      </button>
    </div>
  );
}

export default ToggleSwitch;
