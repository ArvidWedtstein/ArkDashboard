import { useState } from "react";

const ImagePreview = ({
  isOpen,
  setIsOpen,
  image,
  title,
  content,
}: {
  isOpen: boolean;
  setIsOpen?: (open: boolean) => void;
  image?: string;
  title?: string;
  content?: string;
}) => {
  return (
    <div
      id="defaultModal"
      tabIndex={-1}
      aria-hidden={isOpen ? "false" : "true"}
      className={`fixed z-50 w-full place-content-center overflow-y-auto overflow-x-hidden p-4 md:inset-0 md:h-full ${
        isOpen ? "false" : "hidden"
      }`}
    >
      <div className="relative top-1/2 left-1/2 h-full w-full max-w-6xl -translate-x-1/2 transform lg:-translate-y-1/2">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
            {title && (
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            <button
              type="button"
              className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <svg
                aria-hidden={isOpen ? "false" : "true"}
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="space-y-6 p-6">
            {image && <img src={image} className="w-full rounded" />}
            {content && (
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {content}
              </p>
            )}
          </div>
          {/* <div className="flex items-center space-x-2 rounded-b border-t border-gray-200 p-6 dark:border-gray-600">
            <button
              data-modal-toggle="defaultModal"
              type="button"
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              I accept
            </button>
            <button
              data-modal-toggle="defaultModal"
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
            >
              Decline
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
