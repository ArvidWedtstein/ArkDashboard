type LineChartProps = React.HTMLAttributes<HTMLDivElement> & {
  items: {
    name: string;
    percent: number;
    colorHEX?: string;
  }[];
}
const LineChart = ({ items, ...props }: LineChartProps) => {
  let labels = items.sort((a, b) => b.percent - a.percent).map((item, index) => {
    return (
      <div key={index} className="flex items-center text-gray-300">
        <span style={{
          background: item.colorHEX,
        }} className="my-2 h-3 w-3 rounded-full mr-2"></span>
        <span>{item.name}</span>
        <span className="ml-auto">{item.percent}%</span>
      </div>
    )
  })
  return (
    <div {...props}>
      <div className="my-2 rounded-lg p-4 border border-pea-500">
        <div className="flex w-full min-h-1 h-1 rounded-full">
          {items.sort((a, b) => b.percent - a.percent).map((item, index) => (
            <span key={index} style={{
              background: item.colorHEX,
              width: `${item.percent}%`,
            }}></span>
          ))}
        </div>
        <div className="flex flex-col my-2">
          {labels}
        </div>
      </div>
    </div>
  )
}

export default LineChart
