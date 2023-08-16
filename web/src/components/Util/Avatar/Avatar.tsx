import { memo, useState } from "react";
import clsx from "clsx";
import { useAuth } from "src/auth";

interface AvatarProps {
  url: string;
  size: number;
  onUpload?: (path: string) => void;
  className?: string;
  storage?: string;
  editable?: boolean;
}
const Avatar = memo<AvatarProps>(
  ({
    url,
    size,
    onUpload,
    className = "",
    storage = "avatars",
    editable = false,
  }: AvatarProps) => {
    const { client: supabase } = useAuth();

    const [uploading, setUploading] = useState(false);


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

        onUpload?.(filePath);
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
        <div
          className={clsx(
            `relative flex w-full items-center overflow-hidden ring-1 ring-zinc-500 bg-zinc-500 aspect-square justify-center rounded-full`,
            className
          )}
        >
          {url ? (
            <img
              className="h-full w-full rounded-full object-cover object-center aspect-square"
              id="imagePreview"
              src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${url}`}
              alt={"avatar"}
            />
          ) : (
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-600">
              <svg
                className="absolute -left-1 h-10 w-10 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          {editable && (
            <>
              <input
                className="hidden"
                type="file"
                id="imageUpload"
                accept=".png, .jpg, .jpeg"
                onChange={uploadAvatar}
                disabled={uploading}
              />
              <label htmlFor="imageUpload" className="absolute dark:text-white text-black z-0 w-full transition ease-in-out inset-0 hover:backdrop-blur-sm bg-black/40 place-content-center grid hover:opacity-100 opacity-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-8 h-8">
                  <path d="M493.2 56.26l-37.51-37.51C443.2 6.252 426.8 0 410.5 0c-16.38 0-32.76 6.25-45.26 18.75L45.11 338.9c-8.568 8.566-14.53 19.39-17.18 31.21l-27.61 122.8C-1.7 502.1 6.158 512 15.95 512c1.047 0 2.116-.1034 3.198-.3202c0 0 84.61-17.95 122.8-26.93c11.54-2.717 21.87-8.523 30.25-16.9l321.2-321.2C518.3 121.7 518.2 81.26 493.2 56.26zM149.5 445.2c-4.219 4.219-9.252 7.039-14.96 8.383c-24.68 5.811-69.64 15.55-97.46 21.52l22.04-98.01c1.332-5.918 4.303-11.31 8.594-15.6l247.6-247.6l82.76 82.76L149.5 445.2zM470.7 124l-50.03 50.02l-82.76-82.76l49.93-49.93C393.9 35.33 401.9 32 410.5 32s16.58 3.33 22.63 9.375l37.51 37.51C483.1 91.37 483.1 111.6 470.7 124z" />
                </svg>
              </label>
            </>
          )}
        </div>
      </div>
    );
  }
);

export default Avatar;
