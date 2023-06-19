type LineChartProps = React.HTMLAttributes<HTMLDivElement> & {
  items: {
    name: string;
    percent: number;
    colorHEX?: string;
  }[];
};
const LineChart = ({ items, ...props }: LineChartProps) => {
  let labels = items
    .sort((a, b) => b.percent - a.percent)
    .map((item, index) => (
      <div
        key={index}
        className="flex items-center text-[#1f1c2e] dark:text-gray-300"
      >
        <span
          style={{
            background: item.colorHEX,
          }}
          className="my-2 mr-2 h-3 w-3 rounded-full"
        ></span>
        <span>{item.name}</span>
        <span className="ml-auto">{item.percent}%</span>
      </div>
    ));
  return (
    <div {...props}>
      <div className="border-pea-500 my-2 rounded-lg border p-4">
        <div className="min-h-1 flex h-1 w-full rounded-full">
          {items
            .sort((a, b) => b.percent - a.percent)
            .map((item, index) => (
              <span
                key={index}
                style={{
                  background: item.colorHEX,
                  width: `${item.percent}%`,
                }}
              ></span>
            ))}
        </div>
        <div className="my-2 flex flex-col">{labels}</div>
      </div>
    </div>
  );
};

export default LineChart;
