import clsx from "clsx";
import ReactDOM from "react-dom";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type iModal = {
  isOpen?: boolean;
  image?: string;
  title?: string;
  content?: string | React.ReactNode;
  actions?: React.ReactNode;
  form?: React.ReactNode;
  formSubmit?: (formData) => void;
  onClose?: () => void;
};
export const Modal = ({ image, title, content }: iModal) => {
  const { modalOpen, closeModal } = useContext(ModalContext);

  return ReactDOM.createPortal(
    <div
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-hidden={modalOpen ? "false" : "true"}
      className={clsx(
        `fixed z-50 w-full place-content-center overflow-y-auto overflow-x-hidden p-4 backdrop:bg-gray-50 md:inset-0 md:h-full`,
        {
          "animate-pop-up block": modalOpen === true,
          hidden: modalOpen === false,
        }
      )}
      onClick={() => {
        closeModal();
      }}
    >
      <div
        className="relative top-1/2 left-1/2 max-h-full w-full max-w-6xl -translate-x-1/2 transform lg:-translate-y-1/2"
        onClick={(e) => {
          e.stopPropagation();
        }}
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
                closeModal();
              }}
            >
              <svg
                aria-hidden={modalOpen ? "false" : "true"}
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
    </div>,
    document.body
  );
};

interface iModalForm {
  title?: string;
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}
export const FormModal = ({ title, isOpen, children, onClose }: iModalForm) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen == true && !modalRef?.current.open)
      modalRef.current?.showModal();
    else if (isOpen == false && modalRef?.current.open) {
      modalRef.current?.close();
    } else modalRef.current?.close();
  }, [isOpen, modalRef?.current?.open]);

  return (
    <dialog
      className={clsx(
        `animate-pop-up z-10 flex flex-col gap-3 rounded-lg bg-zinc-200 p-3 text-zinc-900 ring-1 ring-zinc-500 backdrop:blur-[3px] dark:bg-zinc-900`,
        {
          hidden: isOpen === false,
        }
      )}
      onCancel={() => {
        modalRef?.current?.querySelector("form")?.reset();
        onClose?.();
      }}
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
            modalRef.current.querySelector("form")?.reset();
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
            modalRef.current.querySelector("form")?.requestSubmit();
            modalRef.current.querySelector("form")?.reset();
            onClose?.();
            modalRef.current?.close();
          }}
        >
          OK
        </button>
        <button
          onClick={() => {
            modalRef.current.querySelector("form")?.reset();
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

const ModalContext = createContext<{
  openModal: () => void;
  closeModal: () => void;
  modalOpen: boolean;
}>({
  openModal: () => { },
  closeModal: () => { },
  modalOpen: false,
});

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{ modalOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };
