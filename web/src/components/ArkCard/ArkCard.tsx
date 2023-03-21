import { AvailableRoutes, Link } from "@redwoodjs/router";
import clsx from "clsx";

interface IArkCard {
  title?: String;
  subtitle?: String | React.ReactNode;
  content?: String;
  ring?: String;
  button?: {
    text: String;
    link: string;
  };
  image?: {
    src: string;
    alt?: string;
    position?: string | number | (string & {});
  } | string;
  icon?: {
    src: string;
    alt?: string;
  };
  className?: string;
}

const ArkCard = ({
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
      className={clsx("relative rounded-3xl bg-gray-600 shadow-md w-auto", className)}
      style={{
        background: typeof image === 'string' ? `${image}` : image ? `url('${image.src}')` : "url()",
        backgroundSize: "cover",
        backgroundPosition: `${typeof image !== 'string' ? (image?.position ?? "center") : "center"}`,
      }}
    >
      <div className="h-full rounded-3xl bg-[#121317] bg-opacity-60 p-4 shadow-md">
        <div className="flex-none lg:flex place-content-center">
          {icon && (
            <div className={clsx("h-fit w-fit lg:mb-0 lg:h-48 lg:w-48", {
              "mb-3 mr-3": title || subtitle || content || ring || button,
            })}>
              <img
                src={icon.src}
                alt={icon.alt ?? "icon"}
                title={icon.alt ?? "icon"}
                className="lg:object-fit rounded-2xl object-scale-down h-full w-full"
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
              <div className="mt-6 inline-flex flex-1 items-center text-sm text-gray-200 ">
                <p>{content}</p>
              </div>
              {(title || subtitle || content) && (<div className="border-t border-gray-300 p-4 pb-2"></div>)}
              <div className="flex items-center justify-between text-sm font-light">
                {ring && (
                  <button className="relative inline-flex items-center justify-center space-x-2 rounded-full bg-gray-600 px-4 py-2.5 text-gray-100 shadow-sm ring-1 ring-green-500">
                    <div className="flex">
                      <span>{ring}</span>
                      <i className="fa-solid fa-circle my-auto ml-2 animate-pulse text-green-500"></i>
                    </div>
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
