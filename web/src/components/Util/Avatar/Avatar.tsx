import { Fragment, MouseEvent, memo, useRef, useState } from "react";
import clsx from "clsx";
import { useAuth } from "src/auth";
import Popper from "../Popper/Popper";
import ClickAwayListener from "../ClickAwayListener/ClickAwayListener";
import { Link, routes } from "@redwoodjs/router";
import List, { ListItem } from "../List/List";

interface AvatarProps {
  url: string;
  size: number;
  onUpload?: (path: string) => void;
  className?: string;
  storage?: string;
  editable?: boolean;
  profileMenu?: boolean;
}
const Avatar = memo<AvatarProps>(
  ({
    url,
    size,
    onUpload,
    className = "",
    storage = "avatars",
    editable = false,
    profileMenu = false,
  }: AvatarProps) => {
    const {
      client: supabase,
      currentUser,
      isAuthenticated,
      logOut,
    } = useAuth();
    const [openProfile, setOpenProfile] = useState(false);
    const anchorRef = useRef(null);

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
        className={"relative flex items-center justify-center"}
        style={{ width: size, height: size, maxWidth: size, maxHeight: size }}
        ref={anchorRef}
      >
        <ClickAwayListener onClickAway={() => setOpenProfile(false)}>
          <div
            className={clsx(
              `relative flex aspect-square w-full items-center justify-center transition-colors overflow-hidden rounded-full bg-zinc-300 border border-secondary-600 dark:bg-zinc-900`,
              className,
              {
                "cursor-pointer hover:border-zinc-500": profileMenu,
              }
            )}
          >
            {url ? (
              <img
                className="aspect-square h-full w-full rounded-full object-cover object-center"
                id="imagePreview"
                src={
                  !!storage
                    ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/${storage}/${url}`
                    : url
                }
                onClick={() => {
                  if (profileMenu) {
                    setOpenProfile(!openProfile);
                  }
                }}
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
              <Fragment>
                <input
                  className="hidden"
                  type="file"
                  id="imageUpload"
                  accept=".png, .jpg, .jpeg"
                  onChange={uploadAvatar}
                  disabled={uploading}
                />
                <label
                  htmlFor="imageUpload"
                  className="absolute inset-0 z-0 grid w-full place-content-center bg-black/40 text-black opacity-0 transition ease-in-out hover:opacity-100 hover:backdrop-blur-sm dark:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                    className="h-8 w-8"
                  >
                    <path d="M493.2 56.26l-37.51-37.51C443.2 6.252 426.8 0 410.5 0c-16.38 0-32.76 6.25-45.26 18.75L45.11 338.9c-8.568 8.566-14.53 19.39-17.18 31.21l-27.61 122.8C-1.7 502.1 6.158 512 15.95 512c1.047 0 2.116-.1034 3.198-.3202c0 0 84.61-17.95 122.8-26.93c11.54-2.717 21.87-8.523 30.25-16.9l321.2-321.2C518.3 121.7 518.2 81.26 493.2 56.26zM149.5 445.2c-4.219 4.219-9.252 7.039-14.96 8.383c-24.68 5.811-69.64 15.55-97.46 21.52l22.04-98.01c1.332-5.918 4.303-11.31 8.594-15.6l247.6-247.6l82.76 82.76L149.5 445.2zM470.7 124l-50.03 50.02l-82.76-82.76l49.93-49.93C393.9 35.33 401.9 32 410.5 32s16.58 3.33 22.63 9.375l37.51 37.51C483.1 91.37 483.1 111.6 470.7 124z" />
                  </svg>
                </label>
              </Fragment>
            )}
          </div>
          {profileMenu && (
            <Popper
              anchorEl={anchorRef.current}
              open={openProfile}
              paddingToAnchor={4}
            // disablePortal
            >
              <div
                className="min-h-[16px] min-w-[16px] rounded bg-white text-black drop-shadow-xl dark:bg-neutral-900 dark:text-white"
                onClick={() => setOpenProfile(false)}
              >
                <List>
                  {isAuthenticated && (
                    <ListItem
                      size="small"
                      className="hover:bg-black/10 dark:hover:bg-white/10"
                      to={routes.profile({
                        id: currentUser?.id || currentUser?.sub || "",
                      })}
                      icon={(
                        <svg
                          className="inline-block h-5 w-5 shrink-0 select-none"
                          focusable="false"
                          fill="currentColor"
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    >
                      Profile
                    </ListItem>
                  )}
                  <ListItem
                    size="small"
                    disableRipple
                    disabled
                    linkProps={{
                      className: 'hover:bg-black/10 dark:hover:bg-white/10'
                    }}
                    icon={(
                      <svg
                        className="inline-block h-5 w-5 shrink-0 select-none"
                        focusable="false"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                      </svg>
                    )}
                  >
                    Settings
                  </ListItem>
                  <hr className="my-2 border-t-[thin] border-black/[.12] dark:border-white/[.12]" />
                  {isAuthenticated ? (
                    <ListItem
                      onClick={logOut}
                      size="small"
                      linkProps={{
                        className: 'hover:bg-black/10 dark:hover:bg-white/10'
                      }}
                      icon={(
                        <svg
                          className="inline-block h-5 w-5 shrink-0 select-none"
                          focusable="false"
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="m17 7-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                      )}
                    >
                      Log Out
                    </ListItem>
                  ) : (
                    <ListItem
                      size="small"
                      linkProps={{
                        className: 'hover:bg-black/10 dark:hover:bg-white/10'
                      }}
                      icon={(
                        <svg
                          className="inline-block h-5 w-5 shrink-0 select-none"
                          focusable="false"
                          fill="currentColor"
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                        >
                          <path d="m17 7-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                      )}
                    >
                      Sign In
                    </ListItem>
                  )}
                </List>
              </div>
            </Popper>
          )}
        </ClickAwayListener>
      </div>
    );
  }
);

export default Avatar;
