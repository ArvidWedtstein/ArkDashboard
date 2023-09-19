import clsx from "clsx";
import { BgColor, StrokeColor } from "src/lib/formatters";

type StatCardProps = React.HTMLAttributes<HTMLDivElement> & {
  stat: string;
  value?: number | string;
  subtext?: string | number;
  chart?: boolean;
  valueDisplay?: "percent" | "number";
  icon?: React.ReactNode;
  /**
   * @default "bg-pink-500"
   * @type {BgColor}
   */
  iconBackground?: string | BgColor;
  text?: string | number;
  circleColor?: StrokeColor;
};
const StatCard = ({
  stat,
  value,
  chart = true,
  icon,
  text,
  iconBackground,
  circleColor,
  subtext,
  valueDisplay = "number",
  ...props
}: StatCardProps) => {
  return (
    <div
      className="relative flex min-w-0 flex-1 flex-col break-words rounded-lg border border-transparent bg-gray-200 text-black shadow-lg transition ease-in-out dark:bg-zinc-700 dark:text-white xl:mb-0"
      {...props}
    >
      <div className="flex-auto p-4">
        <div className="flex flex-shrink flex-row flex-wrap">
          <div className="relative w-full max-w-full flex-1 flex-grow pr-4 text-left">
            <h5 className="text-xs font-bold uppercase text-gray-400">
              {stat}
            </h5>
            {subtext && (
              <span className="block text-xl font-bold">{subtext}</span>
            )}
            {!!value?.toString() && (
              <span className="block text-xl font-bold">
                {valueDisplay === "number" ? value : `${value} / 100`}
              </span>
            )}
          </div>
          {icon && (
            <div className="relative w-auto flex-initial">
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full p-3 text-center text-white shadow-lg ${iconBackground || "bg-pink-500"
                  }`}
              >
                <div className="h-4 w-4 text-current">{icon}</div>
              </div>
            </div>
          )}
          {chart && (
            <div className="relative w-auto flex-initial pl-4">
              <svg
                viewBox="0 0 36 36"
                className="inline-flex h-20 w-20 items-center justify-center text-center text-white"
              >
                <path
                  className="stroke-pea-800 fill-none stroke-1"
                  d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                ></path>
                <path
                  className={clsx(
                    "animate-circle-progress fill-none stroke-2",
                    circleColor || "stroke-pea-500"
                  )}
                  strokeLinecap="round"
                  strokeDasharray={`${value}, 100`}
                  d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                ></path>
                <text
                  textAnchor="middle"
                  x="18"
                  y="19.35"
                  dominantBaseline="middle"
                  fontSize={8}
                  className="fill-black text-center font-normal dark:fill-white"
                >
                  {value}%
                </text>
              </svg>
            </div>
          )}
        </div>
        {text && (
          <p className="mt-4 text-left text-sm text-stone-300">
            <span className="mr-2 inline-flex text-green-500">
              <svg
                className="mr-1 h-4 w-4 text-current"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 384 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6.625 215.5l168-176C179.2 34.7 185.4 32.02 192 32.02s12.84 2.688 17.38 7.438l168 176c9.125 9.594 8.781 24.78-.8125 33.94c-9.5 9.156-24.75 8.812-33.94-.8125L216 115.9V456c0 13.25-10.75 23.1-23.1 23.1S168 469.3 168 456V115.9l-126.6 132.7C32.22 258.2 16.97 258.5 7.438 249.4C-2.156 240.2-2.5 225 6.625 215.5z" />
              </svg>
              {text}
            </span>
            <span className="whitespace-nowrap">Since yesterday</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
