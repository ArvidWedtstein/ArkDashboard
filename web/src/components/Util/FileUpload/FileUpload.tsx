import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "src/auth";
import { formatBytes } from "src/lib/formatters";
import { toast } from "@redwoodjs/web/dist/toast";
import Toast from "../Toast/Toast";
import { useController } from "@redwoodjs/forms";
import Popper from "../Popper/Popper";
import ClickAwayListener from "../ClickAwayListener/ClickAwayListener";
import Button from "../Button/Button";
import { standard } from "src/components/Admin/AdminCell/AdminCell.mock";

type FileUploadProps = {
  variant?: 'standard' | 'outlined' | 'contained';
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "error";
  onUpload?: (url: string) => void;
  onFileAdded?: (file: File) => void;
  /**
   * Used for altering value in forms or before upload
   * @param filename
   * @param isUpload
   * @returns
   */
  valueFormatter?: (filename: string | null, isUpload: boolean) => string;
  className?: string;
  label?: string;
  multiple?: boolean;
  /**
   * Comma seperated list of file names
   */
  defaultValue?: string;
  defaultSecondaryValue?: string;
  storagePath: string;
  sizeLimit?: number;
  /**
   * Name of the input field
   */
  name?: string;
  /**
   * Name of the secondary input field e.g Thumbnail, Icon
   */
  secondaryName?: string;
  /**
   * Comma seperated list of mime file types
   */
  accept?: string;
  /**
   * Max size in bytes
   */
  maxSize?: number;
}

type iFile = {
  file: {
    name: string;
    lastModified: number;
    webkitRelativePath: string;
    size: number;
    type: string;
  };
  [key: string]: unknown;
  preview: boolean;
  state: "newfile" | "uploading" | "uploaded" | "newuploaded";
  url: string;
  error?: {
    type: "oversized" | "invalidType" | "uploadError";
    message: string;
  };
}
// TODO: add support for array of names, and defaultValues
const FileUpload = ({
  storagePath,
  accept = "image/png, image/jpg, image/jpeg, image/webp",
  maxSize,
  onUpload,
  onFileAdded,
  valueFormatter = (e) => e,
  className,
  name,
  secondaryName,
  label,
  defaultValue,
  defaultSecondaryValue,
  variant = "outlined",
  color = "default",
  ...props
}: FileUploadProps) => {
  const { client: supabase } = useAuth();
  const [files, setFiles] = useState<iFile[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [anchorRef, setAnchorRef] = useState<{
    element: HTMLButtonElement | null;
    file: iFile;
    open: boolean;
  }>({ element: null, file: null, open: false });
  // TODO: add support for mulitple file uploads
  const { field } = !!name && useController({ name: name });
  const { field: secondaryField } = !!secondaryName ? useController({ name: secondaryName }) : { field: null };

  const imageUrlToFile = async (imageUrl: string, fileName: string) => {
    try {
      return await fetch(imageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          return new File([blob], fileName, { type: blob.type });
        });
    } catch (error) {
      console.error("Error converting image URL to File:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      if (!defaultValue && (secondaryName && !defaultSecondaryValue)) return;

      try {
        let paths = defaultValue?.split(",").map((img) => img.trim()) || [];

        if (defaultSecondaryValue) {
          paths.push(...defaultSecondaryValue?.split(",").map((img) => img.trim()))
        }

        if (paths.length == 0) return;
        const { data, error } = await supabase.storage
          .from(storagePath)
          .createSignedUrls(
            paths,
            60 * 60 * 24 * 365 * 10
          );

        if (error) {
          console.error(error)
          toast.error(error.message);
          return;
        }

        const promises = data.map(async ({ signedUrl, path }) => {
          const file = await imageUrlToFile(signedUrl, path.split("/").pop());

          const error =
            maxSize && file.size > maxSize
              ? {
                type: "oversized",
                message: `File is too large. Max size is ${formatBytes(
                  maxSize
                )}.`,
              }
              : !accept
                .split(",")
                .map((a) => a.trim().toUpperCase())
                .includes(file.type.toUpperCase())
                ? { type: "invalidType", message: "Invalid file type." }
                : null;

          onFileAdded?.(file);

          return {
            file,
            url: signedUrl,
            state: "uploaded",
            preview: false,
            ...(secondaryName && { [secondaryName]: defaultSecondaryValue.split(",").map((img) => img.trim()).some((f) => f.includes(file.name)) }),
            error,
          };
        });

        const newFiles = (await Promise.all(promises)) as iFile[];
        setFiles((prev) => [
          ...prev.filter(
            (f) => !newFiles.some((nf) => nf.file.name == f.file.name)
          ),
          ...newFiles,
        ]);
      } catch (err) {
        console.error(err)
        toast.error("Error fetching images: ", err);
      }
    };

    if (!!name) {
      field.onChange(defaultValue ? valueFormatter(defaultValue, false) : null);
    }

    if (!!secondaryName) {
      secondaryField.onChange(defaultSecondaryValue ? valueFormatter(defaultSecondaryValue, false) : null)
    }

    fetchImages();
  }, []);

  const readFiles = (ifiles: FileList): void => {
    Array.prototype.forEach.call(ifiles, (file: File) => {
      let reader = new FileReader();

      onFileAdded?.(file);
      reader.onloadend = (fileloader) => {
        if (!file.type || !fileloader.target.result) {
          toast.error("Invalid file type.");
          return;
        }
        setFiles((prev) => [
          ...prev,
          {
            file: file,
            url: fileloader.target.result.toString(),
            state: "newfile",
            preview: false, // TODO: remove
            [secondaryName]: defaultSecondaryValue.split(",").map((img) => img.trim()).some((f) => f.includes(file.name)),
            error:
              maxSize && file.size > maxSize
                ? {
                  type: "oversized",
                  message: `File is too large.${` Max size is ${formatBytes(
                    maxSize
                  )}.`}`,
                }
                : !accept
                  .split(",")
                  .map((a) => a.trim().toUpperCase())
                  .includes(file.type.toUpperCase())
                  ? {
                    type: "invalidType",
                    message: `Invalid file type.`,
                  }
                  : null,
          },
        ]);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    return new Promise(() => {
      const { target } = e;
      if (target?.files.length) {
        readFiles(target.files);
      }
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    return new Promise(() => {
      const { dataTransfer } = e;
      if (dataTransfer.files.length) {
        readFiles(dataTransfer.files);
      }
    });
  };

  const handleUpload = () => {
    if (name) {
      field.onChange(files.map((f) => valueFormatter(f.file.name, false)).join(","))
    }

    if (secondaryName) {
      secondaryField.onChange(files.filter((f) => f[secondaryName] === true).map((f) => valueFormatter(f.file.name, false)).join(','))
    }

    files
      .filter((f) => f.error == null && f.state === "newfile")
      .forEach(async ({ file }) => {
        setFiles((prev) =>
          prev.map((f) =>
            f.file.name === file.name
              ? {
                ...f,
                state: "uploading",
              }
              : f
          )
        );

        let { error } = await supabase.storage
          .from(`${storagePath}`)
          .upload(valueFormatter(file.name, true), file as File)
          .finally(() => {
            setFiles((prev) =>
              prev.map((f) =>
                f.file.name === file.name
                  ? {
                    ...f,
                    state: "newuploaded",
                  }
                  : f
              )
            );
          });

        if (error) {
          setFiles((prev) =>
            prev.map((f) =>
              f.file.name === file.name
                ? {
                  ...f,
                  error: {
                    type: "uploadError",
                    message: error.message,
                  },
                }
                : f
            )
          );
          toast.error(error.message);
        }
        onUpload?.(file.name);
      });
  };

  const handleFileDelete = async (file) => {
    let { error } =
      file.state == "uploaded" || file.state == "newuploaded"
        ? await supabase.storage.from(`${storagePath}`).remove([file.file.name])
        : { error: null };

    if (error) {
      toast.error(error.message);
    } else {
      setFiles((prev) => prev.filter((f) => f.url !== file.url));
    }

    if (name && field) {
      field.onChange(
        files
          .filter((f) => f.url !== file.url)
          .map((f) => f.file.name)
          .join(",")
      );
    }
  };

  const handleClose = (event: React.MouseEvent<Document>) => {
    if (
      anchorRef?.element &&
      anchorRef.element.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setAnchorRef({ element: null, open: false, file: null });
  };

  // TODO: finish classes
  const classes = {
    standard: {
      primary: "border-b border-primary-400 border-opacity-50",
      secondary: "border-b border-zinc-400 border-opacity-50",
      success: "border-b border-success-500 border-opacity-50",
      warning: "border-b border-warning-400 border-opacity-50",
      error: "border-b border-error-500 border-opacity-50",
      default: "border-b dark:border-white border-black dark:border-opacity-50 border-opacity-50"
    },
    outlined: {
      primary: "border border-primary-400 border-opacity-50",
      secondary: "border border-zinc-400 border-opacity-50",
      success: "border border-success-500 border-opacity-50",
      warning: "border border-warning-400 border-opacity-50",
      error: "border border-error-500 border-opacity-50",
      default: "border dark:border-white border-black dark:border-opacity-50 border-opacity-50"
    },
    contained: {
      primary: "",
      secondary: "",
      success: "",
      warning: "",
      error: "",
      default: ""
    },
  }

  return (
    <div
      className={clsx(`group relative flex w-[calc(100%-3rem)] max-w-2xl flex-col gap-2 overflow-hidden rounded p-3 text-gray-900 transition-colors dark:text-stone-200`, classes[variant][color], className)}
    >
      {!!name && (
        <input
          name={name}
          value={files.map((f) => f.file.name).join(", ")}
          readOnly
          hidden
        />
      )}


      {/* {secondaryName && (
                <input
                  type="checkbox"
                  className="hidden"
                  title={secondaryName}
                  name={secondaryName}
                  id={`${secondaryName}-${index}`}
                  // aria-label={file}
                  // aria-checked={file[secondaryName] || false}
                  checked={file[secondaryName] === true}
                  // defaultChecked={Boolean(file[secondaryName]) || false}
                  value={file.file.name}
                  onChange={() => { }}
                  readOnly
                // hidden
                />
              )} */}
      <div className="flex w-full items-center justify-center">
        <label
          htmlFor="dropzone-files"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={clsx("flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed bg-zinc-200/60 transition-colors dark:bg-zinc-700/60 dark:hover:bg-zinc-700 hover:border-opacity-100", classes[variant][color])}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 will-change-contents">
            <svg
              className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload {label}</span> or
              drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {accept &&
                new Intl.ListFormat("en-GB", {
                  style: "long",
                  type: "disjunction",
                }).format(
                  accept
                    .split(",")
                    .map((type) => type.trim().split("/")[1].toUpperCase())
                )}{" "}
              {maxSize && `(MAX. ${formatBytes(maxSize)})`}
            </p>
            {files.some((f) => f.error) && (
              <p className="rw-helper-text -mb-2 text-error-500">
                Invalid files will not be uploaded
              </p>
            )}
          </div>
          <input
            ref={inputRef}
            id="dropzone-files"
            type="file"
            className="hidden"
            accept={accept}
            multiple={props.multiple}
            size={maxSize}
            onChange={handleFileChange}
            hidden
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="table w-full table-auto rounded-lg border border-zinc-500 border-opacity-70 p-2 text-left">
          <div className="table-header-group w-full text-xs text-black dark:text-zinc-300">
            <div className="table-cell p-1"></div>
            <div className="table-cell p-2">Name</div>
            <div className="table-cell w-1/5 p-2">Size</div>
            <div className="table-cell p-2">Last Modified</div>
            <div className="table-cell p-2">Action</div>
          </div>
          {files.map((file, index) => (
            <div
              className={clsx(
                `table-row-group w-full text-xs text-black dark:text-white`,
                {
                  "!text-error-500": file.error,
                }
              )}
              key={`file-${index}`}
              title={file.error ? file.error.message : ""}
            >
              <div className="table-cell">
                <span
                  className={`truncate rounded p-1 text-center align-middle text-[8px] uppercase text-black dark:text-white ${file.error ? "bg-error-500" : "bg-zinc-500"
                    }`}
                >
                  {file.error ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      className="inline h-3 w-3"
                    >
                      <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 480c-123.5 0-224-100.5-224-224s100.5-224 224-224s224 100.5 224 224S379.5 480 256 480zM256 304c8.844 0 16-7.156 16-16V128c0-8.844-7.156-16-16-16S240 119.2 240 128v160C240 296.8 247.2 304 256 304zM256 344c-13.25 0-24 10.75-24 24s10.75 24 24 24s24-10.75 24-24S269.3 344 256 344z" />
                    </svg>
                  ) : file.state == "uploading" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      className="inline h-3 w-3 animate-spin"
                    >
                      <path d="M271.3 32.52C262.8 31.94 256 25.22 256 16.68c0-9.296 7.964-16.72 17.24-16.11C406.4 9.47 512 120.6 512 256c0 40.08-9.393 77.95-25.92 111.7c-4.07 8.32-14.23 11.61-22.27 7.015c-7.108-4.062-10.37-13.09-6.757-20.43C471.7 324.6 480 291.3 480 256C480 137.6 387.7 40.41 271.3 32.52z" />
                    </svg>
                  ) : file.state === "newuploaded" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      className="inline h-3 w-3"
                    >
                      <path d="M475.3 123.3l-272 272C200.2 398.4 196.1 400 192 400s-8.188-1.562-11.31-4.688l-144-144c-6.25-6.25-6.25-16.38 0-22.62s16.38-6.25 22.62 0L192 361.4l260.7-260.7c6.25-6.25 16.38-6.25 22.62 0S481.6 117.1 475.3 123.3z" />
                    </svg>
                  ) : (
                    file.file.name.split(".").pop()
                  )}
                </span>
              </div>
              <div className="table-cell w-2/5 p-2">{file.file.name}</div>
              <div className="table-cell p-2">
                {formatBytes(file.file.size)}
              </div>
              <div className="table-cell truncate p-2">
                {new Date(file.file.lastModified).toDateString()}
              </div>
              <div className="table-cell align-middle relative">
                <button
                  className="relative inline-flex items-center justify-center p-2"
                  type="button"
                  onClick={(e) => {
                    setAnchorRef((prev) => ({
                      element: e.currentTarget || e.target as HTMLButtonElement,
                      open: !prev.open,
                      file: file,
                    }))
                  }}
                >
                  <svg
                    className="w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    fill="currentColor"
                  >
                    <path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z" />
                  </svg>
                  <span className="sr-only">Menu</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {files && files.some((f) => f.preview) && (
        <div className="animate-fade-in relative rounded-lg border border-zinc-500 p-2">
          <button
            className="rw-button rw-button-small rw-button-red absolute top-1 right-1"
            type="button"
            onClick={() => {
              setFiles((prev) =>
                prev.map((f) => ({
                  ...f,
                  preview: false,
                }))
              );
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              className="rw-button-icon-start !mr-0"
            >
              <path d="M315.3 411.3c-6.253 6.253-16.37 6.253-22.63 0L160 278.6l-132.7 132.7c-6.253 6.253-16.37 6.253-22.63 0c-6.253-6.253-6.253-16.37 0-22.63L137.4 256L4.69 123.3c-6.253-6.253-6.253-16.37 0-22.63c6.253-6.253 16.37-6.253 22.63 0L160 233.4l132.7-132.7c6.253-6.253 16.37-6.253 22.63 0c6.253 6.253 6.253 16.37 0 22.63L182.6 256l132.7 132.7C321.6 394.9 321.6 405.1 315.3 411.3z" />
            </svg>
            <span className="sr-only">Close</span>
          </button>
          <img
            src={files.find((f) => f.preview)?.url}
            className="aspect-square w-max max-w-full object-cover"
          />
        </div>
      )}

      <Button color="success" variant={variant === 'standard' ? 'text' : variant} onClick={handleUpload} disabled={files.filter((f) => f.state == "newfile").length < 1}>
        Upload
      </Button>

      <Popper anchorEl={anchorRef?.element} open={anchorRef.open}>
        <ClickAwayListener onClickAway={handleClose}>
          {/* TODO: update to list component */}
          <div
            className="min-h-[16px] min-w-[16px] rounded bg-white text-black drop-shadow-xl dark:bg-neutral-900 dark:text-white"
          >
            <ul className="relative m-0 list-none py-2">
              {secondaryName && (
                <li>
                  <button
                    type="button"
                    className="relative w-full box-border flex cursor-pointer select-none items-center justify-start whitespace-nowrap px-4 py-1.5 text-base font-normal text-current hover:bg-black/10 dark:hover:bg-white/10"
                    onClick={() => {
                      setFiles((prev) =>
                        prev.map((f) => ({
                          ...f,
                          [secondaryName]: f.file.name === anchorRef.file.file.name
                        }))
                      );
                      secondaryField.onChange(files.filter((f) => f.file.name === anchorRef.file.file.name).map((f) => valueFormatter(f?.file?.name, false)).join(','))
                      setAnchorRef({ element: null, open: false, file: null })
                    }}
                  >
                    <div className="inline-flex min-w-[36px] shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        className="inline-block h-4 w-4 shrink-0 select-none fill-current"
                        focusable="false"
                      >
                        <path d="M160 256C160 185.3 217.3 128 288 128C358.7 128 416 185.3 416 256C416 326.7 358.7 384 288 384C217.3 384 160 326.7 160 256zM288 336C332.2 336 368 300.2 368 256C368 211.8 332.2 176 288 176C287.3 176 286.7 176 285.1 176C287.3 181.1 288 186.5 288 192C288 227.3 259.3 256 224 256C218.5 256 213.1 255.3 208 253.1C208 254.7 208 255.3 208 255.1C208 300.2 243.8 336 288 336L288 336zM95.42 112.6C142.5 68.84 207.2 32 288 32C368.8 32 433.5 68.84 480.6 112.6C527.4 156 558.7 207.1 573.5 243.7C576.8 251.6 576.8 260.4 573.5 268.3C558.7 304 527.4 355.1 480.6 399.4C433.5 443.2 368.8 480 288 480C207.2 480 142.5 443.2 95.42 399.4C48.62 355.1 17.34 304 2.461 268.3C-.8205 260.4-.8205 251.6 2.461 243.7C17.34 207.1 48.62 156 95.42 112.6V112.6zM288 80C222.8 80 169.2 109.6 128.1 147.7C89.6 183.5 63.02 225.1 49.44 256C63.02 286 89.6 328.5 128.1 364.3C169.2 402.4 222.8 432 288 432C353.2 432 406.8 402.4 447.9 364.3C486.4 328.5 512.1 286 526.6 256C512.1 225.1 486.4 183.5 447.9 147.7C406.8 109.6 353.2 80 288 80V80z" />
                      </svg>
                    </div>
                    Set as {secondaryName}
                  </button>
                </li>
              )}
              <li>
                <button
                  className="relative w-full box-border flex cursor-pointer select-none items-center justify-start whitespace-nowrap px-4 py-1.5 text-base font-normal text-current hover:bg-black/10 dark:hover:bg-white/10"
                  type="button"
                  onClick={() => {
                    setFiles((prev) =>
                      prev.map((f) => ({
                        ...f,
                        preview: f.file.name === anchorRef?.file?.file?.name,
                      }))
                    );
                    setAnchorRef({ element: null, open: false, file: null })
                  }}
                >
                  <div className="inline-flex min-w-[36px] shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      className="inline-block h-4 w-4 shrink-0 select-none fill-current"
                      focusable="false"
                    >
                      <path d="M160 256C160 185.3 217.3 128 288 128C358.7 128 416 185.3 416 256C416 326.7 358.7 384 288 384C217.3 384 160 326.7 160 256zM288 336C332.2 336 368 300.2 368 256C368 211.8 332.2 176 288 176C287.3 176 286.7 176 285.1 176C287.3 181.1 288 186.5 288 192C288 227.3 259.3 256 224 256C218.5 256 213.1 255.3 208 253.1C208 254.7 208 255.3 208 255.1C208 300.2 243.8 336 288 336L288 336zM95.42 112.6C142.5 68.84 207.2 32 288 32C368.8 32 433.5 68.84 480.6 112.6C527.4 156 558.7 207.1 573.5 243.7C576.8 251.6 576.8 260.4 573.5 268.3C558.7 304 527.4 355.1 480.6 399.4C433.5 443.2 368.8 480 288 480C207.2 480 142.5 443.2 95.42 399.4C48.62 355.1 17.34 304 2.461 268.3C-.8205 260.4-.8205 251.6 2.461 243.7C17.34 207.1 48.62 156 95.42 112.6V112.6zM288 80C222.8 80 169.2 109.6 128.1 147.7C89.6 183.5 63.02 225.1 49.44 256C63.02 286 89.6 328.5 128.1 364.3C169.2 402.4 222.8 432 288 432C353.2 432 406.8 402.4 447.9 364.3C486.4 328.5 512.1 286 526.6 256C512.1 225.1 486.4 183.5 447.9 147.7C406.8 109.6 353.2 80 288 80V80z" />
                    </svg>
                  </div>
                  Preview
                </button>
              </li>
              <li>
                <button
                  className="relative w-full box-border flex cursor-pointer select-none items-center justify-start whitespace-nowrap px-4 py-1.5 text-base font-normal text-current hover:bg-black/10 dark:hover:bg-white/10"
                  type="button"
                  onClick={() => {
                    toast.custom(
                      (t) => (
                        <Toast
                          t={t}
                          variant="error"
                          title={`You're about to delete ${anchorRef.file.file.name}`}
                          message="Are you sure you want to delete this file? This action cannot be undone."
                          primaryAction={() => handleFileDelete(anchorRef.file)}
                        />
                      ),
                      { position: "top-center" }
                    );
                  }}
                >
                  <div className="inline-flex min-w-[36px] shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="inline-block h-4 w-4 shrink-0 select-none fill-current"
                      focusable="false"
                    >
                      <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80c-15.1 0-29.4 7.125-38.4 19.25L112 64H16C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16 0-8.8-7.2-16-16-16zm-280 0l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zm248 64c-8.8 0-16 7.2-16 16v288c0 26.47-21.53 48-48 48H112c-26.47 0-48-21.5-48-48V144c0-8.8-7.16-16-16-16s-16 7.2-16 16v288c0 44.1 35.89 80 80 80h224c44.11 0 80-35.89 80-80V144c0-8.8-7.2-16-16-16zM144 416V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16zm96 0V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16zm96 0V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16z" />
                    </svg>
                  </div>
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default FileUpload;
