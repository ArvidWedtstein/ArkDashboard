import { useEffect, useState } from "react";
import { useAuth } from "@redwoodjs/auth";
import { ImageField } from "@redwoodjs/forms";


const Avatar = ({
  url,
  size,
  onUpload,
  className = "",
  storage = "avatars",
  editable = false,
}: {
  url: string;
  size: number;
  onUpload?: any;
  className?: string;
  storage?: string;
  editable?: boolean;
}) => {
  const { client: supabase } = useAuth();

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from(storage)
        .download(path);
      if (error) {
        throw error;
      }
      if (data) {
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      }
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from(storage)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <div
        className={"relative" + ` max-w-[${size}px] max-h-[${size}px]`}
        style={{ height: size, width: size }}
      >
        {onUpload ? (
          <div className="relative right-3 top-5 z-[1]">
            <input
              className="hidden"
              type="file"
              id="imageUpload"
              accept=".png, .jpg, .jpeg"
              onChange={uploadAvatar}
              disabled={uploading}
            />
            {/* TODO: Fix new edit button */}
            <label
              className="mb-0 inline-block h-[16px] w-[16px] cursor-pointer rounded-full border-2 border-transparent bg-white font-normal shadow-sm transition-all after:absolute after:right-0 after:left-0 after:top-3 after:m-auto after:text-center after:text-[#757575] hover:border-[#d6d6d6] hover:bg-[#f1f1f1]"
              htmlFor="imageUpload"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
              </svg>
            </label>
          </div>
        ) : null}
        <div className={`relative h-full w-full rounded-full border-none border-[#f8f8f8] shadow ${className}`}>
          {avatarUrl ? (
            <div
              className="h-full w-full rounded-full bg-cover bg-center bg-no-repeat"
              id="imagePreview"
              style={{ backgroundImage: `url(${avatarUrl})` }}
            ></div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              className="h-6 w-6"
              fill="currentColor"
              style={{ height: size, width: size }}
              viewBox="0 0 448 512"
            >
              <path d="M328.2 312.6c-1.496-.4863-3.018-.7168-4.521-.7168c-6.17 0-12.04 3.869-14.62 9.787l-35.34 80.94L246.2 320H256c8.844 0 16-7.156 16-16S264.8 288 256 288H192C183.2 288 176 295.2 176 304S183.2 320 192 320h9.791l-27.54 82.64l-35.34-80.94C136.3 315.8 130.5 311.9 124.3 311.9c-1.504 0-3.023 .2285-4.521 .7148c-69.96 22.72-120.5 88.59-119.8 166.3C.1758 497.4 16.16 512 34.66 512H413.3c18.5 0 34.49-14.57 34.65-33.08C448.7 401.2 398.2 335.3 328.2 312.6zM34.66 480c-1.512 0-2.545-1.064-2.656-1.365c-.5117-56.9 32.56-107.5 83.65-130.2L173.1 480H34.66zM240 479.1h-32l-14.62-33.48L224 354.6l30.62 91.88L240 479.1zM413.3 480h-138.4l57.44-131.6c51.1 22.7 84.17 73.3 83.66 130.2C415.9 478.9 414.8 480 413.3 480zM224 256c70.75 0 128-57.25 128-128s-57.25-128-128-128S96 57.25 96 128S153.3 256 224 256zM224 32c52.94 0 96 43.06 96 96c0 52.93-43.06 96-96 96S128 180.9 128 128C128 75.06 171.1 32 224 32z" />
            </svg>
            // <svg
            //   xmlns="http://www.w3.org/2000/svg"
            //   className="h-6 w-6"
            //   fill="none"
            //   viewBox="0 0 24 24"
            //   stroke="currentColor"
            //   style={{ height: size, width: size }}
            // >
            //   <path
            //     strokeLinecap="round"
            //     strokeLinejoin="round"
            //     strokeWidth="2"
            //     d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            //   />
            // </svg>
          )}
        </div>
      </div>
    </>
  );
};

export default Avatar;
