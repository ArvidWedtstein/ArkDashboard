import { AvailableRoutes, Link } from "@redwoodjs/router";
import clsx from "clsx";

interface IArkCard {
  title?: String;
  subtitle?: String | React.ReactNode;
  content?: String | React.ReactNode;
  ring?: String;
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
const ArkCard: React.FC<IArkCard> = React.memo<IArkCard>(({
  title = "",
  subtitle = "",
  content = "",
  ring = "",
  button = null,
  image = null,
  icon = null,
  className = "",
  style = null
}) => {
  return (
    <div
      className={clsx(
        "relative w-auto rounded-3xl shadow-md",
        className,
        { "bg-gray-600": !image }
      )}
      style={{
        ...style,
        background: typeof image === "string" ? `${image}` : image ? `url('${image.src}')` : "url()",
        backgroundSize: "cover",
        backgroundPosition: `${typeof image !== "string" ? image?.position ?? "center" : "center"}`,
      }}
    >
      <div className="h-full bg-[#121317] bg-opacity-60 p-4 rounded-3xl">
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
                className="lg:object-fit h-full w-full rounded-2xl object-scale-down"
              />
            </div>
          )}
          {(title || subtitle || content || ring || button) && (
            <div className="flex-auto justify-evenly py-2">
              <div className="flex flex-wrap">
                <h2 className="flex-auto text-lg font-medium text-gray-50">
                  {title}
                </h2>
                <div className="w-full flex-none text-sm font-bold text-gray-400 ">
                  {subtitle}
                </div>
              </div>
              {((title || subtitle) && (!ring && !button)) && (
                <div className="border-t border-gray-300 p-4 my-2"></div>
              )}
              <div className="mt-6 flex flex-1 items-center text-sm text-gray-200">
                {typeof content === "string" ? <p>{content}</p> : content}
              </div>
              {((title || subtitle || content) && (ring || button)) && (
                <div className="border-t border-gray-300 p-4 my-2"></div>
              )}
              <div className="flex items-center justify-between text-sm font-light">
                {ring && (
                  <button className="relative flex items-center justify-center space-x-2 rounded-full bg-gray-600 px-4 py-2.5 text-gray-100 shadow-sm ring-1 ring-green-500">
                    <span>{ring}</span>
                    <i className="fa-solid fa-circle my-auto ml-2 animate-pulse text-green-500"></i>
                  </button>
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
});
const ArkCard2 = ({
  title = "",
  subtitle = "",
  content = "",
  ring = "",
  button = null,
  image = null,
  icon = null,
  className = "",
}: IArkCard) => {
  return (
    <div
      className={clsx(
        "relative w-auto rounded-3xl shadow-md",
        className,
        { "bg-gray-600": !image }
      )}
      style={{
        background: typeof image === "string" ? `${image}` : image ? `url('${image.src}')` : "url()",
        backgroundSize: "cover",
        backgroundPosition: `${typeof image !== "string" ? image?.position ?? "center" : "center"}`,
      }}
    >
      <div className="h-full bg-[#121317] bg-opacity-60 p-4 rounded-3xl">
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
                className="lg:object-fit h-full w-full rounded-2xl object-scale-down"
              />
            </div>
          )}
          {(title || subtitle || content || ring || button) && (
            <div className="flex-auto justify-evenly py-2">
              <div className="flex flex-wrap">
                <h2 className="flex-auto text-lg font-medium text-gray-50">
                  {title}
                </h2>
                <div className="w-full flex-none text-sm font-bold text-gray-400 ">
                  {subtitle}
                </div>
              </div>
              {((title || subtitle) && (!ring && !button)) && (
                <div className="border-t border-gray-300 p-4 my-2"></div>
              )}
              <div className="mt-6 inline-flex flex-1 items-center text-sm text-gray-200">
                <p>{content}</p>
              </div>
              {((title || subtitle || content) && (ring || button)) && (
                <div className="border-t border-gray-300 p-4 my-2"></div>
              )}
              <div className="flex items-center justify-between text-sm font-light">
                {ring && (
                  <button className="relative flex items-center justify-center space-x-2 rounded-full bg-gray-600 px-4 py-2.5 text-gray-100 shadow-sm ring-1 ring-green-500">
                    <span>{ring}</span>
                    <i className="fa-solid fa-circle my-auto ml-2 animate-pulse text-green-500"></i>
                  </button>
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
};

export default ArkCard;
