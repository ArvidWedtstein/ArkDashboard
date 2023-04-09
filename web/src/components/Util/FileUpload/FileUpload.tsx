import { useAuth } from "@redwoodjs/auth";
import clsx from "clsx";
import { useRef, useState } from "react";
import { pluralize } from "src/lib/formatters";

interface IFileUploadProps {
  onUpload?: (url: any) => void;
  className?: string;
  multiple?: boolean;
  storagePath: string;
  sizeLimit?: number;
  name?: string;
}
const FileUpload = ({
  onUpload,
  storagePath,
  sizeLimit,
  name,
  multiple,
}: IFileUploadProps) => {
  let filename = "";
  let id = Math.round(Math.random() * 100).toString();
  const [files, setFiles] = useState([]);
  const [state, setState] = useState(0);
  const [progress, setProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  let isCopying,
    isUploading = false;
  let progressTimeout = null;
  let el = useRef(null);
  const { client: supabase } = useAuth();

  const handleImagePreview = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  function fileHandle(e) {
    stateDisplay();
    return new Promise(() => {
      const { target } = e;
      if (target?.files.length) {
        let reader = new FileReader();
        reader.onload = (e2) => {
          // setFiles(Array.from(target.files));
          setFiles([...files, ...Array.from(target.files)]);
          fileDisplay(
            files.length > 1 ? `${files.length} files` : target.files[0].name
          );
        };
        reader.readAsDataURL(target.files[0]);
      }
    });
  }
  function stateDisplay() {
    el.current.setAttribute("data-state", `${state}`);
  }
  function fileDisplay(name = "") {
    // update the name
    filename = name;

    // const fileValue = el.current.querySelector("[data-file]");
    // if (fileValue) fileValue.textContent = filename;

    // show the file
    el?.current.setAttribute("data-ready", filename ? "true" : "false");
  }
  const cancel = () => {
    isUploading = false;
    setProgress(0);
    progressTimeout = null;
    setState(0);
    stateDisplay();
    progressDisplay();
    fileReset();
  };
  function fileReset(index = 0) {
    // const fileField: any = el?.current.querySelector(`#fileupload-${id}`);
    // if (fileField) fileField.value = null;
    setFiles(files.filter((file) => file !== files[index]));
    fileDisplay();
  }
  function progressDisplay() {
    const progressValue = el?.current.querySelector("[data-progress-value]");
    const progressFill: any = el?.current.querySelector("[data-progress-fill]");
    const progressTimes100 = Math.floor(progress * 100);

    if (progressValue) progressValue.textContent = `${progressTimes100}%`;
    if (progressFill)
      progressFill.style.transform = `translateX(${progressTimes100}%)`;
  }
  function file() {
    let t: any = el?.current.querySelector(`#fileupload-${id}`);
    t.click();
    stateDisplay();
  }
  function upload() {
    if (!isUploading) {
      isUploading = true;
      setProgress(0);
      setState(1);

      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      let uploadedSize = 0;

      // const uploadPromises = files.map((file) => {
      //   return new Promise(async (resolve, reject) => {
      //     if (sizeLimit && file.size > sizeLimit) {
      //       reject();
      //     }

      //     const fileExt = file.name.split(".").pop();
      //     const fileName = `${Math.random()}.${fileExt}`;
      //     const filePath = `${fileName}`;

      //     let { error: uploadError } = await supabase.storage
      //       .from(`${storagePath}`)
      //       .upload(filePath, file);

      //     if (uploadError) {
      //       reject();
      //     }
      //     onUpload && onUpload(filePath);
      //     uploadedSize += file.size;
      //     setProgress((uploadedSize / totalSize) * 100);
      //     progressDisplay();
      //   });
      // });

      // Promise.all(uploadPromises)
      //   .then(() => {
      //     // All files uploaded successfully
      //     success();

      //     progressLoop();
      //     setFiles([]);
      //   })
      //   .catch((error) => {
      //     // Handle error
      //     console.error("File upload failed", error);
      //     fail();
      //     setProgress(0);
      //   });

      try {
        files.forEach(async (file) => {
          if (sizeLimit && file.size > sizeLimit) {
            fail();
          }

          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          let { error: uploadError } = await supabase.storage
            .from(`${storagePath}`)
            .upload(filePath, file);

          if (uploadError) {
            fail();
          }
          onUpload && onUpload(filePath);
        });
        progressLoop();
      } catch (error) {
        fail();
      } finally {
        success();
      }
    }
    stateDisplay();
  }
  function fail() {
    isUploading = false;
    setProgress(0);
    progressTimeout = null;
    setState(2);
    stateDisplay();
  }
  async function progressLoop() {
    progressDisplay();

    try {
      if (isUploading) {
        if (progress === 0) {
          await new Promise((res) => setTimeout(res, 1000));

          if (!isUploading) {
            return;
          }
        }

        if (progress < 1) {
          setProgress(progress + 0.01);
          progressTimeout = setTimeout(progressLoop.bind(this), 50);
        } else if (progress >= 1) {
          progressTimeout = setTimeout(() => {
            if (isUploading) {
              success();
              stateDisplay();
              progressTimeout = null;
            }
          }, 250);
        }
      }
    } catch (error) {
      fail();
    }
  }
  function success() {
    isUploading = false;
    setState(3);
    stateDisplay();
  }

  async function copy() {
    const copyButton: any = el?.current.querySelector("[data-action='copy']");

    if (!isCopying && copyButton) {
      // disable
      isCopying = true;
      copyButton.style.width = `${copyButton.offsetWidth}px`;
      copyButton.disabled = true;
      copyButton.textContent = "Copied!";
      navigator.clipboard.writeText(filename);
      await new Promise((res) => setTimeout(res, 1000));
      // reenable
      isCopying = false;
      copyButton.removeAttribute("style");
      copyButton.disabled = false;
      copyButton.textContent = "Copy Link";
    }
  }

  return (
    <div
      ref={el}
      className={clsx(
        "group relative w-[calc(100%-3rem)] max-w-xl overflow-hidden rounded-2xl bg-[#f1f2f4] text-slate-700 shadow transition-colors dark:bg-zinc-600 dark:text-stone-200",
        {
          "before:bg-[#f5463d]": state === 2,
          "before:bg-[#3df574]": state === 3,
        }
      )}
      data-state="0"
      data-ready="false"
    >
      <div className="relative z-[1] flex flex-col pt-0 pr-8 pb-7 pl-7">
        <div className="mt-7 flex-1">
          <svg
            className={clsx("animate-fade-in mx-auto h-12 w-12 text-gray-400", {
              block: state === 0,
              hidden: state !== 0,
            })}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* <svg
            className="stroke-pea-500 z-[10] mx-auto block h-12 w-12 fill-transparent text-black"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="origin-[12px_12px] -rotate-[90deg]"
              style={{ strokeDashoffset: "0" }}
              // style={{ strokeDashoffset: "69.12" }}
              cx="12"
              cy="12"
              r="11"
              strokeDasharray="69.12 69.12"
            />
            <polyline
              // style={{ strokeDashoffset: "14.2" }}
              style={{ strokeDashoffset: "0" }}
              points="7 12 12 7 17 12"
              strokeDasharray="14.2 14.2"
            />
            <line
              style={{ strokeDashoffset: "0" }}
              // style={{ strokeDashoffset: "10" }}
              x1="12"
              y1="7"
              x2="12"
              y2="17"
              strokeDasharray="10 10"
            />
          </svg> */}
          {/* <!-- error --> */}
          <svg
            className="m-auto block h-9 w-9 stroke-red-500"
            viewBox="0 0 24 24"
            width="24px"
            height="24px"
            aria-hidden="true"
            display={state === 2 ? "block" : "none"}
          >
            <g
              fill="none"
              stroke="hsl(3,90%,50%)"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle
                className="origin-[12px_12px] -rotate-[90deg]"
                style={{ strokeDashoffset: "69.12" }}
                cx="12"
                cy="12"
                r="11"
                strokeDasharray="69.12 69.12"
              />
              <line
                style={{ strokeDashoffset: "14.2" }}
                x1="7"
                y1="7"
                x2="17"
                y2="17"
                strokeDasharray="14.2 14.2"
              />{" "}
              <line
                style={{ strokeDashoffset: "14.2" }}
                x1="17"
                y1="7"
                x2="7"
                y2="17"
                strokeDasharray="14.2 14.2"
              />
            </g>
          </svg>
          <svg
            className={clsx("m-auto h-9 w-9 stroke-[#0ac241]", {
              block: state === 3,
              hidden: state !== 3,
            })}
            viewBox="0 0 24 24"
            width="24px"
            height="24px"
            aria-hidden="true"
          >
            <g
              fill="none"
              stroke="hsl(138,90%,50%)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle
                className="origin-[12px_12px] -rotate-[90deg]"
                // style={{ strokeDashoffset: "69.12" }}
                style={{ strokeDashoffset: "0" }}
                cx="12"
                cy="12"
                r="11"
                strokeDasharray="69.12 69.12"
              />
              <polyline
                // style={{ strokeDashoffset: "14.2" }}
                style={{ strokeDashoffset: "0" }}
                points="7 12.5 10 15.5 17 8.5"
                strokeDasharray="14.2 14.2"
              />
            </g>
          </svg>
        </div>
        <div className="mt-3 flex-1">
          <div
            className={clsx("modal__content", {
              block: state === 0,
              hidden: state !== 0,
            })}
          >
            <h2 className="mb-6 text-center text-xl font-medium leading-5">
              Upload {multiple ? "Files" : "a File"}
            </h2>
            <p className="mb-6 min-h-[3rem] text-center text-base">
              Select a file to upload from your computer or device.
            </p>
            <div className="mb-2 flex flex-wrap items-center delay-200">
              <button
                className="w-full flex-1 rounded border-2 border-dashed border-[#737a8c] bg-transparent py-2 px-8 text-xs text-current transition-colors hover:bg-[#8f95a3] focus:outline-none disabled:opacity-50 "
                type="button"
                onClick={file}
              >
                Choose {multiple ? "Files" : "File"}
              </button>
              <input
                id={`fileupload-${id}`}
                name={name || "fileupload"}
                multiple={multiple}
                onChange={fileHandle}
                type="file"
                hidden
              />
            </div>
            <div
              className={`flex-wrap items-center delay-200 group-data-[ready=true]:flex group-data-[ready=false]:hidden`}
            >
              {files.map((file, index) => (
                <div className="flex w-full flex-row items-center">
                  <svg
                    className="mr-3 block h-6 w-6 text-[#737a8c] transition-colors"
                    viewBox="0 0 24 24"
                    width="24px"
                    height="24px"
                    aria-hidden="true"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="4 1 12 1 20 8 20 23 4 23" />
                      <polyline points="12 1 12 8 20 8" />
                    </g>
                  </svg>

                  <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                    {file.name}
                  </div>

                  <button
                    className="mx-2 block cursor-pointer text-current"
                    type="button"
                    onClick={() => handleImagePreview(file)}
                  >
                    Preview
                  </button>

                  <button
                    className="block cursor-pointer py-2 text-current"
                    type="button"
                    onClick={() => fileReset(index)}
                  >
                    <svg
                      className="pointer-events-none m-auto block h-auto w-full"
                      viewBox="0 0 16 16"
                      width="16px"
                      height="16px"
                      aria-hidden="true"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <polyline points="4,4 12,12" />
                        <polyline points="12,4 4,12" />
                      </g>
                    </svg>
                    <span className="absolute h-[1px] w-[1px] overflow-hidden">
                      Remove
                    </span>
                  </button>
                </div>
              ))}
            </div>
            {files.length > 0 && (
              <button
                className="mt-3 w-full rounded bg-[#737a8c] py-2 px-4 text-xs text-current transition-colors hover:bg-[#8f95a3] focus:outline-none disabled:opacity-50"
                type="button"
                onClick={upload}
              >
                Upload
              </button>
            )}
            {imagePreview && (
              <div className="mt-3 bg-slate-700 p-4 pt-2">
                <button
                  className="rw-button rw-button-small rw-button-red float-right my-2"
                  type="button"
                  onClick={() => setImagePreview(null)}
                >
                  Close
                </button>
                <img src={imagePreview} alt="Image Preview" />
              </div>
            )}
          </div>
          <div
            className={clsx("modal__content", {
              block: state === 1,
              hidden: state !== 1,
            })}
          >
            <h2 className="mb-6 text-center text-xl font-medium leading-5">
              Uploading…
            </h2>
            <p className="mb-6 min-h-[3rem] text-center text-base">
              Just give us a moment to process your file.
            </p>
            <div className="flex flex-wrap items-center delay-200">
              <div className="flex-1">
                <div
                  className="text-right text-xs font-bold leading-5"
                  data-progress-value
                >
                  0%
                </div>
                <div className="h-[0.4rem] w-full overflow-hidden">
                  <div
                    className="h-full w-full bg-[#e3e4e8] transition-transform"
                    data-progress-fill
                  ></div>
                </div>
              </div>
              <button
                className="w-full rounded bg-[#737a8c] py-2 px-8 text-xs text-current transition-colors hover:bg-[#8f95a3] focus:outline-none disabled:opacity-50"
                type="button"
                onClick={cancel}
              >
                Cancel
              </button>
            </div>
          </div>
          <div
            className={clsx("modal__content", {
              block: state === 2,
              hidden: state !== 2,
            })}
          >
            <h2 className="mb-6 text-center text-xl font-medium leading-5">
              Oops!
            </h2>
            <p className="mb-6 min-h-[3rem] text-base">
              Your file could not be uploaded due to an error. Try uploading it
              again?
            </p>
            <div className="flex flex-wrap items-center delay-200">
              <button
                className="w-full rounded bg-[#737a8c] py-2 px-8 text-xs text-current transition-colors hover:bg-[#8f95a3] focus:outline-none disabled:opacity-50"
                type="button"
                onClick={upload}
              >
                Retry
              </button>
              <button
                className="mt-3 w-full rounded bg-[#737a8c] py-2 px-8 text-xs text-current transition-colors hover:bg-[#8f95a3] focus:outline-none disabled:opacity-50"
                type="button"
                onClick={cancel}
              >
                Cancel
              </button>
            </div>
          </div>
          <div
            className={clsx(`modal__content`, {
              block: state === 3,
              hidden: state !== 3,
            })}
          >
            <h2 className="mb-6 text-center text-xl font-medium leading-5">
              Upload Successful!
            </h2>
            <p className="mb-6 min-h-[3rem] text-base">
              Your {pluralize(files.length, "file")} has been uploaded.
              {files.length == 1 && "You can copy the link to your clipboard."}
            </p>
            <div className="flex flex-wrap items-center delay-200">
              {files.length == 1 && (
                <button
                  className="w-full rounded bg-[#737a8c] py-2 px-8 text-xs text-current transition-colors hover:bg-[#8f95a3] focus:outline-none disabled:opacity-50"
                  type="button"
                  data-action="copy"
                  onClick={copy}
                >
                  Copy Link
                </button>
              )}
              <button
                className="mt-3 w-full rounded bg-[#737a8c] py-2 px-8 text-xs text-current transition-colors hover:bg-[#8f95a3] focus:outline-none disabled:opacity-50"
                type="button"
                onClick={cancel}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
