import clsx from "clsx"
import { BgColor, StrokeColor } from "src/lib/formatters"

type StatCardProps = React.HTMLAttributes<HTMLDivElement> & {
  stat: string
  value: number | string
  valueof?: number | string
  chart?: boolean
  icon?: React.ReactNode
  iconBackground?: string | BgColor
  text?: boolean
  circleColor?: StrokeColor
}
const StatCard = ({ stat, value, chart = true, icon, text = false, iconBackground, circleColor, valueof, ...props }: StatCardProps) => {
  return (
    <div className="relative flex flex-col min-w-0 break-words flex-1 bg-gray-200 dark:bg-zinc-700 rounded-lg xl:mb-0 transition ease-in-out shadow-lg dark:text-white text-black border border-transparent" {...props}>
      <div className="flex-auto p-4">
        <div className="flex flex-row flex-wrap flex-shrink">
          <div className="relative w-full pr-4 max-w-full flex-grow flex-1 text-left">
            <h5 className="text-gray-400 uppercase font-bold text-xs">{stat}</h5>
            <span className="font-bold text-xl">{value} {valueof && `/ ${valueof}`}</span>
          </div>
          {icon && (
            <div className="relative w-auto flex-initial">
              <div className={`text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full ${iconBackground || 'bg-pink-500'}`}>
                <div className="w-4 h-4 text-current">
                  {icon}
                </div>
              </div>
            </div>
          )}
          {chart && (
            <div className="relative w-auto pl-4 flex-initial">
              <svg viewBox="0 0 36 36" className="text-white text-center inline-flex items-center justify-center w-20 h-20">
                <path className="fill-none stroke-1 stroke-[#557b88]" d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                <path className={clsx("fill-none stroke-2 animate-circle-progress", circleColor || "stroke-[#00cfde]")} strokeLinecap="round" strokeDasharray={`${value}, 100`} d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                <text textAnchor="middle" x="18" y="19.35" dominantBaseline="middle" fontSize={8} className="fill-black dark:fill-white text-center font-normal">{value}%</text>
              </svg>
            </div>
          )}
        </div>
        {text && (
          <p className="text-left text-sm text-stone-300 mt-4">
            <span className="text-green-500 mr-2 inline-flex">
              <svg className="mr-1 w-4 h-4 text-current" aria-hidden="true" fill="currentColor" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.625 215.5l168-176C179.2 34.7 185.4 32.02 192 32.02s12.84 2.688 17.38 7.438l168 176c9.125 9.594 8.781 24.78-.8125 33.94c-9.5 9.156-24.75 8.812-33.94-.8125L216 115.9V456c0 13.25-10.75 23.1-23.1 23.1S168 469.3 168 456V115.9l-126.6 132.7C32.22 258.2 16.97 258.5 7.438 249.4C-2.156 240.2-2.5 225 6.625 215.5z" />
              </svg>
              1.10%</span>
            <span className="whitespace-nowrap">Since yesterday</span>
          </p>
        )}
      </div>
    </div>
  )
}




export default StatCard
