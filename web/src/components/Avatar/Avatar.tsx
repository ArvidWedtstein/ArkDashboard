import { memo, useEffect, useState } from "react";
import clsx from "clsx";
import { useAuth } from "src/auth";

interface AvatarProps {
  url: string;
  size: number;
  // sizes?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onUpload?: (path: string) => void;
  className?: string;
  storage?: string;
  editable?: boolean;
}
const Avatar = memo<AvatarProps>(
  ({
    url,
    size,
    // sizes,
    onUpload,
    className = "",
    storage = "avatars",
    editable = false,
  }: AvatarProps) => {
    const { client: supabase } = useAuth();

    // const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

    // useEffect(() => {
    //   if (!!url) {
    //     downloadImage(url);
    //   }
    // }, [url]);

    // const downloadImage = async (path) => {
    //   try {
    //     const { data, error } = await supabase.storage
    //       .from(storage)
    //       .download(path);
    //     if (error) throw error;
    //     if (data) setAvatarUrl(URL.createObjectURL(data));
    //   } catch (error) {
    //     console.log("Error downloading image: ", error.message);
    //   }
    // };


    const uploadAvatar = async (event) => {
      try {
        setUploading(true);
        if (!event.target.files || event.target.files.length === 0)
          throw new Error("You must select an image to upload.");

        const file = event.target.files[0];
        const [, fileExt] = file.name.split(".");
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = fileName;
        const { error: uploadError } = await supabase.storage
          .from(storage)
          .upload(filePath, file);
        if (uploadError) throw uploadError;
        onUpload && onUpload(filePath);
      } catch (error) {
        alert(error.message);
      } finally {
        setUploading(false);
      }
    };

    return (
      <div
        className={
          "relative flex items-center justify-center" +
          ` max-w-[${size}px] max-h-[${size}px]`
        }
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
              className="mb-0 inline-block h-[16px] w-[16px] cursor-pointer rounded-full border-2 border-transparent bg-white font-normal transition-all after:absolute after:right-0 after:left-0 after:top-3 after:m-auto after:text-center after:text-[#757575] hover:border-[#d6d6d6] hover:bg-[#f1f1f1]"
              htmlFor="imageUpload"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
              </svg>
            </label>
          </div>
        ) : null}
        <div
          className={clsx(
            `relative flex h-full w-full items-center justify-center rounded-full border-none border-[#f8f8f8]`,
            className
          )}
        >
          {url ? (
            <img className="w-full h-full rounded-full" id="imagePreview" src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${url}`} alt={'avatar'} />
          ) : (
            <div className="relative w-8 h-8 overflow-hidden bg-zinc-100 rounded-full dark:bg-zinc-600">
              <svg className="absolute w-10 h-10 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default Avatar;
