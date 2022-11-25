const StatCard = () => {
  return (
    <div>
      <div className="p-2">
        <div className="rounded p-4 w-100 flex items-center bg-gray-800">
          <div className="shrink-0 basis-28">
            <h2 className="mb-2 text-xs uppercase font-semibold text-slate-600">Shortlisted</h2>
            <span className="text-2xl font-medium text-white">5.5 K</span>
          </div>
          <div className="relative flex-1 min-w-min max-w-xs">
            <svg viewBox="0 0 36 36" className="">
              <path className="fill-none stroke-1 stroke-[#00cfde]" d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"></path>
              <path className="fill-none stroke-2 stroke-[#557b88] animate-circle-progress" strokeDasharray="60, 100" d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"></path>
              <text textAnchor="middle" x="18" y="20.35" className="fill-white text-xs font-normal">60%</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard
