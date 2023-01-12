type StatCardProps = React.HTMLAttributes<HTMLDivElement> & {
  stat: string
  value: number
}
const StatCard = ({ stat, value, ...props }: StatCardProps) => {
  return (
    <div>
      <div {...props}>
        <div className="sm:rounded md:rounded-lg p-4 flex items-center bg-stone-200 dark:bg-neutral-800 border dark:border-stone-200 border-neutral-800">
          <div className="shrink-0 basis-28">
            <h2 className="mb-2 sm:text-xs md:text-base uppercase font-semibold dark:text-stone-200 text-slate-600">{stat}</h2>
            <span className="text-2xl font-medium text-white">{value}</span>
          </div>
          <div className="relative flex-1 min-w-min max-w-xs ml-auto">
            <svg viewBox="0 0 36 36" className="">
              <path className="fill-none stroke-1 stroke-[#557b88]" d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"></path>
              <path className="fill-none stroke-2 stroke-[#00cfde] animate-circle-progress" strokeLinecap="round" strokeDasharray={`${value}, 100`} d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"></path>
              <text textAnchor="middle" x="18" y="20.35" dominantBaseline="middle" className="fill-white text-xs text-center font-normal">{value}%</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard
