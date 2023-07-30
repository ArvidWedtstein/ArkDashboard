import clsx from "clsx";
import { useCallback, useRef, useState } from "react";
import { useAuth } from "src/auth";
import { pluralize } from "src/lib/formatters";

interface IFileUploadProps {
  onUpload?: (url: string) => void;
  className?: string;
  multiple?: boolean;
  storagePath: string;
  sizeLimit?: number;
  name?: string;
  thumbnail?: boolean;
}
const FileUpload = ({
  onUpload,
  storagePath,
  sizeLimit,
  name,
  multiple,
  thumbnail = false,
}: IFileUploadProps) => {
  let filename = "";
  let id = Math.round(Math.random() * 100).toString();
  const [files, setFiles] = useState<
    { file: any; imagePreviewUrl: string | ArrayBuffer; thumbnail?: boolean }[]
  >([]);

  const [state, setState] = useState(0);
  const [progress, setProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  let elRef = useRef(null);
  const { client: supabase } = useAuth();
  let isCopying,
    isUploading = false;
  let progressTimeout = null;

  const handleImagePreview = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const fileHandle = (e) => {
    stateDisplay();
    return new Promise(() => {
      const { target } = e;
      if (target?.files.length) {
        let reader = new FileReader();
        reader.onload = (e2) => {
          setFiles([
            ...files,
            ...Array.from(target.files).map((file) => ({
              file,
              imagePreviewUrl: reader.result,
              thumbnail: false,
            })),
          ]);
          fileDisplay(
            files.length > 1 ? `${files.length} files` : target.files[0].name
          );
        };
        reader.readAsDataURL(target.files[0]);
      }
    });
  };
  const handleDrop = (event) => {
    event.preventDefault();
    stateDisplay();
    let reader = new FileReader();
    reader.onload = (e2) => {
      reader.result;
      setFiles((prev) => [
        ...prev,
        ...Array.from(event.dataTransfer.files).map((file) => ({
          file,
          imagePreviewUrl: reader.result,
          thumbnail: false,
        })),
      ]);
      fileDisplay(
        files.length > 1
          ? `${files.length} files`
          : event.dataTransfer.files[0].name
      );
    };
    reader.readAsDataURL(event.dataTransfer.files[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const stateDisplay = () => {
    elRef.current.setAttribute("data-state", `${state}`);
  };

  const fileDisplay = (name = "") => {
    // update the name
    filename = name;

    // show the file
    elRef?.current.setAttribute("data-ready", filename ? "true" : "false");
  };
  const cancel = () => {
    isUploading = false;
    setProgress(0);
    progressTimeout = null;
    setState(0);
    stateDisplay();
    progressDisplay();
    fileReset();
  };

  const fileReset = (index = 0) => {
    setFiles((prev) => prev.filter((file) => file !== files[index]));
    fileDisplay(files.length > 1 ? `${files.length} files` : "");
    stateDisplay();
  };

  const progressDisplay = () => {
    const progressValue = elRef?.current.querySelector("[data-progress-value]");
    const progressFill: HTMLElement = elRef?.current.querySelector(
      "[data-progress-fill]"
    );
    const progressTimes100 = Math.floor(progress * 100);

    if (progressValue) progressValue.textContent = `${progressTimes100}%`;
    if (progressFill)
      progressFill.style.transform = `translateX(${progressTimes100}%)`;
  };

  const file = () => {
    let t: HTMLInputElement = elRef?.current.querySelector(`#fileupload-${id}`);
    t.click();
    stateDisplay();
  };

  const upload = () => {
    if (!isUploading) {
      isUploading = true;
      setProgress(0);
      setState(1);

      try {
        files.forEach(async ({ file }) => {
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
          onUpload?.(filePath);
        });
        progressLoop();
      } catch (error) {
        fail();
      } finally {
        success();
      }
    }
    stateDisplay();
  };
  const fail = () => {
    isUploading = false;
    setProgress(0);
    progressTimeout = null;
    setState(2);
    stateDisplay();
  };

  const progressLoop = async () => {
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
  };

  const success = () => {
    isUploading = false;
    setState(3);
    stateDisplay();
  };

  const copy = async () => {
    const copyButton: HTMLButtonElement = elRef?.current.querySelector(
      "[data-action='copy']"
    );

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
  };

  return (
    <div
      ref={elRef}
      className={clsx(
        "group relative w-[calc(100%-3rem)] max-w-xl overflow-hidden rounded-lg border border-zinc-500 bg-zinc-50 text-gray-900 transition-colors dark:border-zinc-500 dark:bg-zinc-600 dark:text-stone-200",
        {
          "before:bg-[#f5463d]": state === 2,
          "before:bg-[#3df574]": state === 3,
        }
      )}
      data-state="0"
      data-ready="false"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
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
            className={clsx("text-center", {
              block: state === 0,
              hidden: state !== 0,
            })}
          >
            <h2 className="mb-6 text-center text-xl font-medium leading-5">
              Upload {multiple ? "Files" : "a File"}
            </h2>
            <p className="mb-6 min-h-[3rem] text-center text-base">
              Select a file to upload from your computer or device
              <br />
              or drag and drop a file here.
            </p>
            <div className="mb-2 flex flex-wrap items-center delay-200">
              <button
                className="w-full flex-1 rounded border-2 border-dashed border-[#737a8c] bg-transparent py-2 px-8 text-xs text-current transition-colors hover:bg-[#8f95a3] focus:outline-none disabled:opacity-50 "
                type="button"
                onClick={file}
              >
                Choose {multiple ? "Files" : "File"} or drop files here
              </button>
              <input
                id={`fileupload-${id}`}
                name={name || "fileupload"}
                multiple={multiple}
                onChange={fileHandle}
                type="file"
                accept="image/png, image/jpeg"
                hidden
              />
            </div>
            {/* File list */}
            <div
              className={`flex-wrap items-center delay-200 group-data-[ready=true]:flex group-data-[ready=false]:hidden`}
            >
              {files.map(({ file }, index) => (
                <div
                  className="flex w-full flex-row items-center justify-start space-x-3"
                  key={`file-${index}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    className="h-5 w-5 text-white/60 transition-colors"
                    fill="currentColor"
                  >
                    {file.type.includes("image") ? (
                      <path d="M190.3 285.7l-26.36 40.67c-12-14.92-37.75-13.73-48.31 2.531l-46.69 72.02c-5.984 9.266-6.531 21.09-1.453 30.84C72.67 441.8 82.83 448 93.1 448h196c11.17 0 21.33-6.219 26.55-16.23c5.094-9.797 4.531-21.62-1.484-30.86l-74.66-115.2C229.3 268.5 201.4 268.5 190.3 285.7zM286.7 416L95.77 416l44.89-66.95l9.922 15.3c5.906 9.094 20.97 9.094 26.84 0l37.91-58.48L286.7 416zM96 280c13.25 0 24-10.75 24-24c0-13.26-10.75-24-24-24S72 242.7 72 256C72 269.3 82.75 280 96 280zM365.3 125.3l-106.5-106.5C246.7 6.742 230.5 0 213.5 0H64C28.65 0 0 28.65 0 64l.0065 384c0 35.35 28.65 64 64 64H320c35.35 0 64-28.65 64-64V170.5C384 153.5 377.3 137.3 365.3 125.3zM224 34.08c4.477 1.566 8.666 3.846 12.12 7.299l106.5 106.5C346.1 151.3 348.4 155.5 349.9 160H240C231.2 160 224 152.8 224 144V34.08zM352 448c0 17.64-14.36 32-32 32H64c-17.64 0-32-14.36-32-32V64c0-17.64 14.36-32 32-32h128v112C192 170.5 213.5 192 240 192H352V448z" />
                    ) : (
                      <path d="M365.3 125.3l-106.5-106.5C246.7 6.742 230.5 0 213.5 0L64-.0001c-35.35 0-64 28.65-64 64l.0065 384c0 35.35 28.65 64 64 64H320c35.35 0 64-28.65 64-64v-277.5C384 153.5 377.3 137.3 365.3 125.3zM342.6 147.9C346.1 151.3 348.4 155.5 349.9 160H240C231.2 160 224 152.8 224 144V34.08c4.477 1.566 8.666 3.846 12.12 7.299L342.6 147.9zM352 448c0 17.64-14.36 32-32 32H64c-17.64 0-32-14.36-32-32V64c0-17.64 14.36-32 32-32h128v112C192 170.5 213.5 192 240 192H352V448z" />
                    )}
                  </svg>

                  <div className="flex-grow text-ellipsis whitespace-nowrap text-left text-xs">
                    {file.name}
                  </div>

                  <button
                    className="mx-2 block cursor-pointer text-current"
                    type="button"
                    onClick={() => handleImagePreview(file)}
                  >
                    Preview
                  </button>

                  {thumbnail && (
                    <input
                      type="radio"
                      className="rw-input rw-input-small"
                      title="thumbnail"
                      name="thumbnail"
                      checked={files[index].thumbnail}
                      value={files[index].file.name}
                      onChange={(e) => {
                        setFiles((prev) => {
                          prev[index].thumbnail = e.target.checked;
                          return prev;
                        });
                      }}
                    />
                  )}

                  <button
                    className="hover:text-red-500"
                    type="button"
                    onClick={() => fileReset(index)}
                    title="Remove"
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
                    <span className="sr-only">Remove</span>
                  </button>
                </div>
              ))}
            </div>
            {files.length > 0 && (
              <button
                className="rw-button rw-button-gray-outline rw-button-medium mt-3 w-full"
                type="button"
                onClick={upload}
              >
                Upload
              </button>
            )}
            {imagePreview && (
              <div className="mt-3 rounded-lg bg-zinc-700 p-2">
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
            className={clsx("text-center", {
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
            className={clsx("text-center", {
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
            className={clsx(`text-center`, {
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
