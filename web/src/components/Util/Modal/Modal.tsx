import clsx from "clsx";
import ReactDOM from "react-dom";
import { Children, HTMLAttributes, ReactNode, createContext, forwardRef, isValidElement, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import Button from "../Button/Button";
import ClickAwayListener from "../ClickAwayListener/ClickAwayListener";
import { Transition } from 'react-transition-group'
type iModal = {
  isOpen?: boolean;
  image?: string;
  mimetype?: string;
  title?: string;
  content?: string | React.ReactNode;
  actions?: React.ReactNode;
  form?: React.ReactNode;
  formSubmit?: (formData) => void;
  onClose?: () => void;
};

/**
 * @description A modal is a self-contained UI component that typically appears as a pop-up or overlay on top of the main content.
 *
 * WHEN TO USE:
 * - For user interactions that require the user's immediate attention or input, such as alert messages, confirmations, or forms.
 * - For shorter, focused interactions that temporarily interrupt the main workflow.
 *
 * @returns a modal
 */
export const Modal = ({ content, image, title, mimetype }: iModal) => {
  const { modalOpen, closeModal } = useModal();

  return ReactDOM.createPortal(
    <div
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-hidden={modalOpen ? "false" : "true"}
      className={clsx(
        `fixed inset-0 z-50 w-full place-content-center p-4 md:inset-0`,
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
        className="relative top-1/2 left-1/2 max-h-full w-full max-w-6xl -translate-x-1/2 transform lg:-translate-y-1/2 md:h-full"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="m-8 dark:text-white text-black shadow-lg bg-zinc-300 dark:bg-zinc-800 rounded relative overflow-y-auto ">
          <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
            {title && (
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            <Button
              color="error"
              variant="icon"
              className="ml-auto"
              onClick={() => closeModal()}
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
            </Button>
          </div>
          <div className="space-y-6 p-6">
            {image || mimetype ? mimetype?.startsWith("image") ? (
              <img src={image} className="w-full rounded" />
            ) : (
              <video
                src={image}
                className="w-full rounded"
                autoPlay={false}
                controlsList="nodownload"
                controls
              />
            ) : null}
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

type ModalContextValue = {
  openModal: () => void;
  closeModal: () => void;
  modalOpen: boolean;
};

const ModalContext = createContext<ModalContextValue>({
  openModal: () => { },
  closeModal: () => { },
  modalOpen: false,
});

type ModalProviderProps = {
  children: JSX.Element;
};

// TODO: https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
export const ModalProvider = ({ children }: ModalProviderProps) => {
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

export const useModal = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
};

// type ModalProps = {
//   children?: React.ReactNode
// }
// export const Modal2 = forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
//   const {
//     children
//   } = props;

//   const { modalOpen, closeModal } = useModal();
//   const transitionStyles = {
//     entering: { opacity: 1 },
//     entered: { opacity: 1 },
//     exiting: { opacity: 0 },
//     exited: { opacity: 0 },
//   };
//   return ReactDOM.createPortal((
//     <Transition nodeRef={ref} in={true} timeout={500}>
//       {(state) => (
//         <div aria-label="Modal" className={clsx("fixed inset-0 z-50", {
//           "block": modalOpen === true,
//           hidden: modalOpen === false,
//         })} ref={ref} style={{
//           ...transitionStyles[state]
//         }}>
//           <div aria-label="backdrop" className="fixed flex items-center justify-center inset-0 bg-black/50 -z-10" />
//           <ClickAwayListener onClickAway={() => {
//             closeModal();
//           }}>
//             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-fit bg-zinc-500">
//               {Children.map(children, (child, i) => {
//                 if (!isValidElement(child)) {
//                   return null;
//                 }
//                 return React.cloneElement(child as React.ReactElement<any>, {})
//               })}
//             </div>
//           </ClickAwayListener>
//         </div>
//       )}
//     </Transition>
//   ), document.documentElement)
// })
