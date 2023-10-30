import { Link } from "@redwoodjs/router";
import clsx from "clsx";
import { memo } from "react";

interface IArkCard {
  title?: String;
  subtitle?: String | React.ReactNode;
  content?: String | React.ReactNode;
  ring?: String | React.ReactNode;
  button?: {
    text: String;
    link: string;
  };
  image?:
  | {
    src: string;
    alt?: string;
    position?: string | number | (string & {});
  }
  | string;
  icon?: {
    src: string;
    alt?: string;
  };
  className?: string;
  style?: React.CSSProperties;
}

/**
 * @deprecated Use Card component instead.
 */
const ArkCard = memo<IArkCard>(
  ({
    title = "",
    subtitle = "",
    content = "",
    ring = "",
    button = null,
    image = null,
    icon = null,
    className = "",
    style = null,
  }) => {
    return (
      <div
        className={clsx("relative w-auto rounded-lg shadow-md", className, {
          "bg-stone-300 dark:bg-zinc-600": !image,
        })}
        style={{
          ...style,
          background:
            typeof image === "string"
              ? `${image}`
              : image
                ? `url('${image.src}')`
                : "",
          backgroundSize: "cover",
          backgroundPosition: `${typeof image !== "string" ? image?.position ?? "center" : "center"
            }`,
        }}
      >
        <div
          className={clsx("h-full rounded-lg p-4", {
            "bg-[#121317] bg-opacity-60": image && typeof image !== "string",
          })}
        >
          <div className="flex-none place-content-center lg:flex">
            {icon && (
              <div
                className={clsx("h-fit w-fit lg:mb-0 lg:h-48 lg:w-48", {
                  "mb-3 mr-3": title || subtitle || content || ring || button,
                })}
              >
                <img
                  src={icon.src}
                  alt={icon.alt ?? "icon"}
                  title={icon.alt ?? "icon"}
                  loading="lazy"
                  className="lg:object-fit h-full w-full rounded-lg object-scale-down"
                />
              </div>
            )}
            {(title || subtitle || content || ring || button) && (
              <div className="flex-auto justify-evenly py-2">
                <div className="flex flex-wrap">
                  <h2
                    className={clsx("flex-auto text-lg font-medium", {
                      "text-gray-50": image && typeof image !== "string",
                      "text-gray-200 dark:text-gray-50": !image,
                    })}
                  >
                    {title}
                  </h2>
                  <div className="w-full flex-none text-sm font-bold text-gray-700 dark:text-gray-400">
                    {subtitle}
                  </div>
                </div>
                {(title || subtitle) && !ring && !button && (
                  <div className="my-2 border-t border-gray-700 p-4 dark:border-gray-300"></div>
                )}
                <div className="mt-6 flex flex-1 items-center text-sm text-gray-200 dark:text-gray-200">
                  {typeof content === "string" ? <p>{content}</p> : content}
                </div>
                {(title || subtitle || content) && (ring || button) && (
                  <div className="my-2 border-t border-gray-300 p-4"></div>
                )}
                <div className="flex items-center justify-between text-sm font-light">
                  {ring && typeof ring === "string" ? (
                    <button className="relative flex items-center justify-center space-x-2 rounded-full bg-stone-300 px-4 py-2.5 text-gray-300 shadow-sm ring-1 ring-green-500 dark:bg-zinc-600 dark:text-gray-100">
                      <span>{ring}</span>
                      <i className="fa-solid fa-circle my-auto ml-2 animate-pulse text-green-500"></i>
                    </button>
                  ) : (
                    ring
                  )}

                  {button && (
                    <Link
                      to={button.link}
                      className="rw-button rw-button-green-outline !rounded-full"
                    >
                      {button.text}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default ArkCard;
