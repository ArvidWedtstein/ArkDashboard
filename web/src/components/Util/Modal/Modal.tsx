import { useEffect } from "react";
import useComponentVisible from "src/components/useComponentVisible";

type iModal = {
  isOpen: boolean;
  setIsOpen?: (open: boolean) => void; // not used
  image?: string;
  title?: string;
  content?: string | React.ReactNode;
  actions?: React.ReactNode;
  form?: React.ReactNode;
  formSubmit?: (formData) => void;
  onClose?: () => void;
};
export const RefModal = ({
  isOpen,
  onClose,
  image,
  title,
  content,
}: iModal) => {
  const {
    ref: modalRef,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(isOpen);
  useEffect(() => {
    setIsComponentVisible(isOpen);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isComponentVisible) {
      onClose();
    }
    // if (modalRef.current) setIsComponentVisible(!isComponentVisible);
  }, [modalRef]);

  return true ? (
    <div
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-hidden={isComponentVisible ? "false" : "true"}
      className={`fixed z-50 w-full place-content-center overflow-y-auto overflow-x-hidden p-4 backdrop:bg-gray-50 md:inset-0 md:h-full ${
        isComponentVisible === true ? "block" : "hidden"
      }`}
    >
      <div
        ref={modalRef}
        className=" relative top-1/2 left-1/2 max-h-full w-full max-w-6xl -translate-x-1/2 transform lg:-translate-y-1/2"
      >
        <div className="relative rounded-lg bg-white shadow dark:bg-zinc-700">
          <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
            {title && (
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            <button
              type="button"
              className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => {
                onClose();
              }}
            >
              <svg
                aria-hidden={isComponentVisible ? "false" : "true"}
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
            {content &&
              (typeof content == "string" ? (
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {content}
                </p>
              ) : (
                content
              ))}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export const Modal = ({
  isOpen,
  onClose,
  image,
  title,
  content,
  actions,
  form,
  formSubmit,
}: iModal) => {
  return (
    <div
      tabIndex={-1}
      aria-hidden={isOpen ? "false" : "true"}
      className={`fixed z-50 w-full place-content-center overflow-y-auto overflow-x-hidden p-4 md:inset-0 md:h-full ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="relative top-1/2 left-1/2 h-full w-full max-w-6xl -translate-x-1/2 transform lg:-translate-y-1/2">
        <form
          onSubmit={(e) => {
            formSubmit && formSubmit(e);
            e.currentTarget.reset();
          }}
          className="relative rounded-lg bg-white shadow dark:bg-zinc-700"
        >
          {/* <div className="relative rounded-lg bg-white shadow dark:bg-gray-700"> */}
          <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
            {title && (
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            <button
              type="button"
              className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => {
                onClose();
              }}
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
            {content &&
              (typeof content == "string" ? (
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {content}
                </p>
              ) : (
                content
              ))}
            {form && formSubmit && form}
          </div>
          <div className="flex items-center space-x-2 rounded-b border-t border-gray-200 p-6 dark:border-gray-600">
            <button
              className="rw-button rw-button-blue"
              onClick={() => onClose()}
              type={form && formSubmit ? "submit" : "button"}
            >
              {form && formSubmit ? "Submit" : "OK"}
            </button>
            <button
              data-modal-toggle="defaultModal"
              onClick={() => onClose()}
              type="button"
              className="rw-button rw-button-red-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
