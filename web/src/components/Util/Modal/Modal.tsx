import { Form } from "@redwoodjs/forms";
import clsx from "clsx";
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
  // useEffect(() => {
  //   console.log(isOpen)
  //   setIsComponentVisible(isOpen);
  // }, [isOpen, onClose]);

  return (
    <div
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-hidden={isOpen ? "false" : "true"}
      className={clsx(
        `fixed z-50 w-full place-content-center overflow-y-auto overflow-x-hidden p-4 backdrop:bg-gray-50 md:inset-0 md:h-full`,
        {
          "animate-pop-up block": isOpen === true,
          hidden: isOpen === false,
        }
      )}
    >
      <div
        ref={modalRef}
        className="relative top-1/2 left-1/2 max-h-full w-full max-w-6xl -translate-x-1/2 transform lg:-translate-y-1/2"
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
                setIsComponentVisible(false);
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
          </div>
        </div>
      </div>
    </div>
  );
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
        {!form && (
          <div className="relative rounded-lg bg-white shadow dark:bg-zinc-700"></div>
        )}
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            formSubmit && formSubmit(e);
            e.currentTarget.reset();
          }}
          className="relative rounded-lg bg-white shadow dark:bg-zinc-700"
        >
          <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
            {title && (
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            <button
              type="button"
              className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={(e) => {
                e.currentTarget.form.reset();
                onClose && onClose();
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
            {!actions && (
              <>
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
              </>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

interface iModalForm {
  title?: string;
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}
export const FormModal = ({ title, isOpen, children, onClose }: iModalForm) => {
  const modalRef = React.useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (isOpen == true && !modalRef?.current.open)
      modalRef.current?.showModal();
    else if (isOpen == false && modalRef?.current.open) {
      modalRef.current?.close();
    } else modalRef.current?.close();
  }, [isOpen, modalRef?.current?.open]);
  return (
    <dialog
      className={`animate-pop-up text-text-950 bg-accent-50 z-10 flex flex-col gap-3 rounded-lg p-3 ring-1 ring-zinc-500 backdrop:blur-[3px] dark:bg-zinc-900`}
      onCancel={() => {
        modalRef?.current?.querySelector("form")?.reset();
        onClose?.();
      }}
      id="dialog"
      ref={modalRef}
    >
      <div className="flex items-start justify-between border-b border-zinc-500 pb-3">
        {title && (
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        )}
        <button
          type="button"
          className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={(e) => {
            modalRef.current.querySelector("form").reset();
            onClose?.();
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

      {children}

      <div className="flex items-center justify-end space-x-2 rounded-b border-t border-zinc-500 pt-3">
        <button
          className="rw-button rw-button-blue"
          onClick={() => {
            modalRef.current.querySelector("form").requestSubmit();
            modalRef.current.querySelector("form").reset();
            onClose?.();
            modalRef.current?.close();
          }}
        >
          OK
        </button>
        <button
          onClick={() => {
            modalRef.current.querySelector("form").reset();
            onClose?.();
          }}
          type="button"
          className="rw-button rw-button-red"
          formMethod="dialog"
        >
          Cancel
        </button>
      </div>
    </dialog>
  );
};
