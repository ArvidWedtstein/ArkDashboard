import clsx from "clsx";
import { useState } from "react";
import { debounce } from "src/lib/formatters";

interface TagInputProps {
  name?: string;
  defaultValue?: string;
}
const TagInput = ({ name, defaultValue = "" }) => {
  const [isFadingOut, setIsFadingOut] = useState<number>(-1);
  const [tags, setTags] = useState<string[]>(
    defaultValue?.trim()
      .split(", ")
      .filter((t) => t !== "")
  );

  const handleKeyDown = (e) => {
    if (e.target.value.includes(',') || e.key === "Enter") {
      setTags([...tags, e.target.value.replace(',', '')]);
      e.target.value = "";
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-1 text-gray-600 dark:text-zinc-200">
        {tags.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className={clsx(
              "inline-flex items-center rounded border border-zinc-500 bg-gray-100 px-2 py-1 text-sm font-medium text-gray-800 dark:bg-zinc-700 dark:text-gray-300",
              {
                "animate-fade-out": isFadingOut === idx,
              }
            )}
          >
            {tag}
            <button
              type="button"
              className="ml-2 inline-flex items-center rounded-sm bg-transparent p-0.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-zinc-600 dark:hover:text-gray-300"
              onClick={() => {
                setIsFadingOut(idx);
                debounce(() => {
                  setTags(tags.filter((t, i) => i !== idx));
                  setIsFadingOut(-1);
                }, 300)();
              }}
              aria-label="Remove"
            >
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Remove badge</span>
            </button>
          </span>
        ))}
      </div>
      <div className="relative max-w-sm">
        <input
          className="rw-float-input peer"
          placeholder=" "
          onKeyDown={handleKeyDown}
        />
        <label className="rw-float-label">Tags</label>
      </div>
      <input type="hidden" name={name} value={tags.join(", ")} />
    </>
  );
};

export default TagInput;
