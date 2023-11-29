import {
  useMemo,
} from "react";
import {
  ArrayElement,
  IntRange,
  drawCatmullRomChart,
  formatNumber,
  generateChartColors,
  groupBy,

} from "src/lib/formatters";

type AxisData = {
  id?: string;
  data?: (string | number)[];
  label?: string;
  scaleType?: "linear" | "log" | "time" | "band" | "point" | "ordinal";
  scale?: any;
  dataKey?: string;
  valueFormatter?: (value: string | number) => string;
  axisValues?: Readonly<AxisValue[]>;
  min?: number;
  max?: number;
  valueMin?: number;
  valueMax?: number;
  disableLine?: boolean;
  disableTicks?: boolean;
  tickSize?: IntRange<0, 100>;
  position?: AxisPosition;
}[];
type ChartContainerProps = {
  xAxis?: AxisData;
  yAxis?: AxisData;
  dataset?: {
    [key: string]: number | string;
  }[];
  series?: {
    dataKey?: string;
    label?: string;
    stack?: string;
    data?: number[];
    color?: string;
  }[];
  width?: number;
  height?: number;
};

const numberToChart = (
  chartData: ChartContainerProps & {
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    availableWidth: number;
    availableHeight: number;
    max: number;
    min: number;
  },
  value: number,
  isXAxis: boolean = true,
  scaleType: string = "linear"
): number => {
  const { width, height, availableWidth, availableHeight, margin, max, min } =
    chartData;
  const range =
    scaleType === "log"
      ? Math.log10(max + 1) - Math.log10(min)
      : Math.ceil(max - min);

  const relativeValue = (value - min) / range;

  if (scaleType === "log") {
    const logMin = Math.log10(min);
    const logMax = Math.log10(max + 1); // Add 1 to handle log(0)

    return isXAxis
      ? width -
      margin.left -
      ((Math.log10(min) + relativeValue * (logMax - logMin)) /
        (logMax - logMin)) *
      availableWidth
      : height -
      margin.top -
      ((Math.log10(min) + relativeValue * (logMax - logMin)) /
        (logMax - logMin)) *
      availableHeight;
  }

  return isXAxis
    ? ((value - min) / (max - min)) * availableWidth
    : height - margin.bottom - relativeValue * availableHeight;
};

type AxisPosition = "left" | "right" | "top" | "bottom";
type AxisValue = {
  x: number | null;
  y: number | null;
  value: number;
  xText: number;
  yText: number;
  textAnchor: "middle" | "end";
  dominantBaseline: "hanging" | "central";
  xLine: number;
  yLine: number;
  isMarkerPoint: boolean;
  stepSize: number;
};

const generateAxisRangeValues = (
  chartData: ChartContainerProps & {
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    availableWidth?: number;
    availableHeight?: number;
    max: number;
    min: number;
  },
  scaleType = "linear",
  position: AxisPosition = "bottom",
  tickSize: number,
  disableTicks: boolean = false,
  data: any[] = []
): AxisValue[] => {
  const { availableWidth, availableHeight, max, min, margin } = chartData;
  const isHorizontal = position === "top" || position === "bottom";

  const labelsNumber =
    (scaleType === "point" ? data.length - 1 : data.length) || 0;

  const labelStep = (labelsNum: number) =>
    (isHorizontal ? availableWidth : availableHeight) / labelsNum;

  // Determine the ideal number of steps based on chart height
  const idealStepCount = isHorizontal
    ? availableWidth / Math.sqrt(availableWidth)
    : availableHeight / 10;

  // Calculate the raw step size
  const rawStepSize = (max - min) / idealStepCount;

  // Calculate a rounded step size for even steps
  const stepExponent = Math.floor(Math.log(rawStepSize));
  const stepMultiplier = Math.pow(
    max - min <= 100 ? (max - min <= 10 ? 1 : 10) : 5,
    stepExponent
  );
  const stepSize = Math.ceil(rawStepSize / stepMultiplier) * stepMultiplier;


  // Calculate the number of steps based on the rounded step size
  const stepCount = Math.ceil((max - min) / stepSize);

  // Generate Axis values with even steps
  return Array.from(
    {
      length:
        (scaleType === "band" || scaleType === "point"
          ? labelsNumber
          : stepCount) + 1,
    },
    (_, i) => {
      const value =
        (isFinite(min) && min != 0 ? min - (min % stepMultiplier) : 0) +
        i *
        (scaleType === "band" || scaleType === "point"
          ? labelStep(labelsNumber)
          : stepSize);

      const xy = isHorizontal
        ? scaleType === "band" || scaleType === "point"
          ? margin.left + value
          : margin.left +
          numberToChart(
            {
              ...chartData,
              min: min - (min % stepMultiplier),
              availableWidth,
              availableHeight,
            },
            value,
            isHorizontal
          )
        : scaleType === "band" || scaleType === "point"
          ? margin.top + value
          : numberToChart(
            {
              ...chartData,
              min: min - (min % stepMultiplier),
              availableWidth,
              availableHeight,
            },
            value,
            isHorizontal
          );

      const v =
        scaleType === "log"
          ? isFinite(Math.log10(value))
            ? Math.log10(value)
            : 0
          : scaleType === "band" || scaleType === "point"
            ? data[i]
            : value;

      return {
        x: isHorizontal ? xy : 0,
        y: isHorizontal ? 0 : xy,
        value: v,
        stepSize:
          scaleType === "band" || scaleType === "point"
            ? labelStep(labelsNumber - 1)
            : stepSize,
        xText: isHorizontal
          ? scaleType === "band"
            ? labelStep(labelsNumber) / 2
            : 0
          : position === "left"
            ? disableTicks
              ? -7
              : -(3 + tickSize)
            : disableTicks
              ? 7
              : 3 + tickSize,
        yText: isHorizontal ? (disableTicks ? 7 : 3 + tickSize) : scaleType === "band"
          ? labelStep(labelsNumber) / 2
          : 0,
        textAnchor: isHorizontal
          ? "middle"
          : position === "left"
            ? "end"
            : "start",
        dominantBaseline: isHorizontal ? "hanging" : "central",
        xLine: isHorizontal ? 0 : position === "left" ? -tickSize : tickSize,
        yLine: isHorizontal ? tickSize : 0,
        isMarkerPoint:
          scaleType === "band"
            ? !!v
            : data.length > 0
              ? data.includes(v)
              : true,
      };
    }
  ) as AxisValue[];
};




type BaseChartSeries = {
  id?: string | number;
  dataKey?: string;
  color?: string;
  label?: string;
  yAxisKey?: string;
  xAxisKey?: string;
};

type PieChartSeries = BaseChartSeries & {
  data?: {
    id?: string | number;
    value: number;
    label?: string;
    color?: string;
  }[];
  /** The radius between the center and the beginning of the arc. The default is set to 0. */
  innerRadius?: number;
  /** The radius between the center and the end of the arc. The default is the largest value available in the drawing area. */
  outerRadius?: number;
  /** The padding angle between each pie slice */
  paddingAngle?: number;
  /**
   * TODO: implement
   * Similar to the CSS border-radius.
   * NOT IMPLEMENTED YET PLZ HELP
   */
  cornerRadius?: number;
  /** The angle range of the pie chart. Values are given in degrees. */
  startAngle?: number;
  /** The angle range of the pie chart. Values are given in degrees. */
  endAngle?: number;
  /** The center of the pie charts. By default the middle of the drawing area. */
  cx?: number;
  /** The center of the pie charts. By default the middle of the drawing area. */
  cy?: number;
  /** Should percentage be shown? */
  arcLabel?: boolean;
};

type LineChartSeries = BaseChartSeries & {
  data?: number[];
  area?: boolean;
  showMark?: (({ index }: { index: number }) => boolean) | boolean;
};

type BarChartSeries = BaseChartSeries & {
  data?: number[];
};

type ScatterChartSeries = BaseChartSeries & {
  data?: { x: number; y: number; id?: number | string }[];
};

type IChartProps = {
  type: "bar" | "line" | "pie" | "scatter";
  /**
   * X-Axis data.
   * Used to control the x positions of the data points in series
   */
  xAxis?: AxisData;
  yAxis?: AxisData;
  dataset?: {
    [key: string]: number | string;
  }[];
  width?: number;
  height?: number;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  leftAxis?: string;
  rightAxis?: string;
  topAxis?: string;
  bottomAxis?: string;
};

type ChartPropsWithType = {
  pie: IChartProps & { series: PieChartSeries[] };
  line: IChartProps & { series: LineChartSeries[] };
  bar: IChartProps & { series: BarChartSeries[] };
  scatter: IChartProps & { series: ScatterChartSeries[] };
}[IChartProps["type"]];

const Chart = ({
  xAxis,
  yAxis,
  series = [],
  dataset = [],
  width = 600,
  height = 400,
  leftAxis = "left",
  rightAxis,
  topAxis,
  bottomAxis = "bottom",
  type = "line",
  margin: chartMargin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  },
}: ChartPropsWithType) => {
  const margin = {
    top: chartMargin.top ?? 50,
    right: chartMargin.right ?? 50,
    bottom: chartMargin.bottom ?? 50,
    left: chartMargin.left ?? 50,
  };
  const availableWidth = width - margin.left - margin.right;
  const availableHeight = height - margin.top - margin.bottom;

  const categoryGapRatio = 0.1;
  const barGapRatio = 0.4;

  const AxisPositionMap: { [key: string]: AxisPosition } = {
    [leftAxis]: "left",
    [rightAxis]: "right",
    [topAxis]: "top",
    [bottomAxis]: "bottom",
  };

  const dataSeries: ChartPropsWithType["series"] = useMemo(() => {
    // Autogenerate unique hex colors

    return series?.map((s, i) => {
      const colors = generateChartColors(
        type === "pie" ? s.data.length : Array(series.length).length
      );
      return {
        ...s,
        xAxisKey: s.xAxisKey ?? bottomAxis,
        yAxisKey: s.yAxisKey ?? leftAxis,
        color: s?.color || colors[i],
        data:
          (dataset.length > 0 && s.dataKey
            ? dataset?.map((d) => parseInt(d[s.dataKey].toString()))
            : type === "pie"
              ? s?.data?.map((d, i) => {
                return {
                  ...d,
                  color: d?.color || colors[i],
                  value: parseInt(d.value.toString()),
                };
              })
              : s.data) ?? [],
      };
    });
  }, [series, dataset]);

  const xAxisData = (xAxis ?? [{ id: "bottom" }]).map((x) => {
    let id = x?.id ?? "bottom";
    let position: AxisPosition = AxisPositionMap[id] || "bottom";

    let data =
      (dataset.length > 0 && x.dataKey
        ? dataset?.map((d) => d[x.dataKey])
        : x.data) ?? [];

    let scaleType = x.scaleType ?? "linear";
    let tickSize = x.tickSize ?? 6;

    let valueMin =
      x.min ??
      Math.min(
        ...[type === "bar" ? 0 : null,
        ...(!data || data.length == 0
          ? dataSeries.flatMap((s) =>
            type === "scatter"
              ? s.data.map((x) =>
                position === "top" || position === "bottom" ? x.x : x.y
              )
              : s.data
          )
          : data && data.every((x) => !isNaN(parseInt(x.toString())))
            ? data.map((x) => parseInt(x.toString()))
            : [])].filter(x => x != null)
      ) ??
      null;
    let valueMax =
      x.max ??
      Math.max(
        ...(!data || data.length == 0
          ? dataSeries.flatMap((s) =>
            type === "scatter"
              ? s.data.map((x) =>
                position === "top" || position === "bottom" ? x.x : x.y
              )
              : s.data
          )
          : data && data.every((x) => !isNaN(parseInt(x.toString())))
            ? data.map((x) => parseInt(x.toString()))
            : [])
      ) ??
      null;

    const axisValues = generateAxisRangeValues(
      {
        margin,
        width,
        height,
        min: valueMin,
        max: valueMax,
        availableWidth,
        availableHeight,
      },
      scaleType,
      position,
      tickSize,
      x.disableTicks ?? false,
      data
    );

    return {
      ...x,
      id,
      data,
      axisValues,
      scaleType,
      valueMin,
      valueMax,
      position,
      disableLine: x.disableLine ?? false,
      disableTicks: x.disableTicks ?? false,
      tickSize,
    };
  });

  const yAxisData = (yAxis ?? [{ id: "left" }])?.map((y) => {
    let id = y?.id ?? "left";
    let position: AxisPosition = AxisPositionMap[id] || "left";

    let scaleType = y.scaleType ?? "linear";
    let tickSize = y.tickSize ?? 6;

    let disableTicks = y.disableTicks ?? false;

    let data =
      (dataset.length > 0 && y.dataKey
        ? dataset?.map((d) => {
          if (scaleType === 'linear') {
            return parseInt(d[y.dataKey].toString())
          }
          return d[y.dataKey]
        })
        : y.data) ?? [];

    let valueMin =
      y.min ??
      Math.min(
        type === "bar" ? 0 : null, ...(!data || data.length == 0
          ? dataSeries.flatMap((s) =>
            type === "scatter"
              ? s.data.map((x) =>
                position === "top" || position === "bottom" ? x.x : x.y
              )
              : s.data
          )
          : data && data.every((x) => !isNaN(parseInt(x.toString())))
            ? data.map((x) => parseInt(x.toString()))
            : [])
      );
    let valueMax =
      y.max ??
      Math.max(
        ...dataSeries.flatMap((s) =>
          type === "scatter"
            ? s.data.map((x) =>
              position === "top" || position === "bottom" ? x.x : x.y
            )
            : s.data
        ),
        ...(y?.data && y?.data.every((x) => !isNaN(parseInt(x.toString())))
          ? y.data.map((x) => parseInt(x.toString()))
          : [])
      );

    const axisValues = generateAxisRangeValues(
      {
        margin,
        width,
        height,
        min: valueMin,
        max: valueMax,
        availableWidth,
        availableHeight,
      },
      scaleType,
      position,
      tickSize,
      disableTicks,
      data
    );

    return {
      ...y,
      id,
      data,
      axisValues,
      scaleType,
      valueMin,
      valueMax,
      position,
      disableLine: y.disableLine ?? false,
      disableTicks,
      tickSize,
    };
  });

  // TODO: use this to calculate all chart types?
  const pointData = dataSeries.map((d, i) => {
    const xAxis = xAxisData.find((axis) =>
      axis?.id ? axis.id === d.xAxisKey : true
    );
    const yAxis = yAxisData.find((axis) =>
      axis?.id ? axis.id === d.yAxisKey : true
    );

    const bandAxis = [...xAxisData, ...yAxisData].find((axis) =>
      type === 'bar' ? axis.scaleType === "band" : true
    );

    const minX = isFinite(xAxis?.valueMin)
      ? xAxis?.valueMin
      : 0;
    const maxX = isFinite(xAxis?.valueMax)
      ? xAxis?.valueMax
      : 0;

    const minY = isFinite(yAxis?.valueMin)
      ? yAxis?.valueMin
      : isFinite(xAxis?.valueMin) && type == 'bar'
        ? xAxis?.valueMin
        : 0;
    const maxY = isFinite(yAxis?.valueMax)
      ? yAxis?.valueMax
      : isFinite(xAxis?.valueMax) && type == 'bar'
        ? xAxis?.valueMax
        : 0;

    const {
      cx = width / 3,
      cy = height / 2,
      startAngle = 0,
      endAngle = 360,
      paddingAngle = 5,
      innerRadius = 0,
      outerRadius = 100,
      cornerRadius = 0,
      arcLabel,
    } = d;

    let sliceStartAngle = startAngle;

    const totalValue = d.data.reduce(
      (acc, dataSlice) => acc + dataSlice.value,
      0
    );

    // #region Bar

    if (type === 'bar') {
      const groupSize = bandAxis && bandAxis.axisValues.length > 0 ? bandAxis?.axisValues[0].stepSize - (dataSeries.length - 1) : 0;

      // Calculate category spacing
      const categorySpacing = groupSize * categoryGapRatio;

      // Calculate bar width and gap
      const totalBarSize =
        (groupSize - categorySpacing) / dataSeries.length;
      const barSize = totalBarSize * (1 - barGapRatio);
      const barGap = totalBarSize * barGapRatio;

      const isXAxis = bandAxis ? bandAxis.position === "bottom" || bandAxis.position === "top" : false;

      return d.data
        .map((val, index) => {
          const rectWidth = isXAxis
            ? barSize
            : ((val - minX) / (maxX - minX)) * availableWidth;
          const rectHeight = isXAxis
            ? ((val - minY) / (maxY - minY)) * availableHeight
            : barSize;

          const x = isXAxis
            ? Math.round(
              (i * (barSize + barGap) + categorySpacing / 2) *
              1000
            ) / 1000
            : 0

          const y = isXAxis
            ? height - margin.bottom - rectHeight
            : Math.round(
              (i * (barSize + barGap) + categorySpacing / 2) *
              1000
            ) / 1000


          return {
            x,
            y,
            groupX: isXAxis ? bandAxis.axisValues[index].x - margin.left : 0,
            groupY: isXAxis ? 0 : bandAxis.axisValues[index].y,
            width: rectWidth,
            height: rectHeight,
            value: val,
            color: d.color,
          }
        })
    }
    // #endregion

    return d.data
      .map((val, index) => {
        const x =
          type === "scatter"
            ? numberToChart(
              {
                width,
                height,
                availableWidth,
                availableHeight,
                margin,
                min: minX,
                max: maxX,
              },
              val.x,
              true,
              xAxis.scaleType
            )
            : xAxis.scaleType === "point"
              ? xAxis.axisValues[index].x - margin.left
              : xAxis.scaleType === "linear" &&
                xAxis.data.length > 0 &&
                xAxis.data.every((x) => !isNaN(parseInt(x.toString())))
                ? index < xAxis.data.length
                  ? numberToChart(
                    {
                      width,
                      height,
                      availableWidth,
                      availableHeight,
                      margin,
                      min: minX,
                      max: maxX,
                    },
                    parseInt(xAxis.data[index].toString()),
                    true,
                    xAxis.scaleType
                  )
                  : null
                : index < xAxis.axisValues.length
                  ? xAxis.axisValues[index].x - margin.left
                  : numberToChart(
                    {
                      width,
                      height,
                      availableWidth,
                      availableHeight,
                      margin,
                      min: minX,
                      max: maxX,
                    },
                    index,
                    true,
                    xAxis.scaleType
                  );

        const y =
          type === "scatter"
            ? numberToChart(
              {
                width,
                height,
                availableWidth,
                availableHeight,
                margin,
                min: minX,
                max: maxX,
              },
              val.y,
              false,
              xAxis.scaleType
            )

            : isNaN(numberToChart(
              {
                width,
                height,
                availableWidth,
                availableHeight,
                margin,
                min: minY,
                max: maxY,
              },
              val,
              false,
              yAxis.scaleType
            )) ? 0 : numberToChart(
              {
                width,
                height,
                availableWidth,
                availableHeight,
                margin,
                min: minY,
                max: maxY,
              },
              val,
              false,
              yAxis.scaleType
            );


        //#region Pie
        if (type === "pie") {
          const outerRadiusSize = Math.min(cx, cy) - outerRadius;
          const innerRadiusValue = Math.max(0, innerRadius);

          // Calculate slice percentage out of total value
          const slicePercentage = (val.value / totalValue) * 100;

          const sliceAngle =
            (val.value / totalValue) *
            (endAngle - startAngle - d.data.length * paddingAngle);

          const sliceEndAngle = sliceStartAngle + sliceAngle;

          const largeArcFlag = sliceAngle > 180 ? 1 : 0;

          // Calculate the start and end points of the slice
          const startX =
            cx +
            outerRadiusSize *
            Math.cos((sliceStartAngle - 90) * (Math.PI / 180));
          const startY =
            cy +
            outerRadiusSize *
            Math.sin((sliceStartAngle - 90) * (Math.PI / 180));
          const endX =
            cx +
            outerRadiusSize * Math.cos((sliceEndAngle - 90) * (Math.PI / 180));
          const endY =
            cy +
            outerRadiusSize * Math.sin((sliceEndAngle - 90) * (Math.PI / 180));

          // Calculate the start and end points of the inner circle
          const innerStartX =
            cx +
            innerRadiusValue *
            Math.cos((sliceStartAngle - 90) * (Math.PI / 180));
          const innerStartY =
            cy +
            innerRadiusValue *
            Math.sin((sliceStartAngle - 90) * (Math.PI / 180));
          const innerEndX =
            cx +
            innerRadiusValue * Math.cos((sliceEndAngle - 90) * (Math.PI / 180));
          const innerEndY =
            cy +
            innerRadiusValue * Math.sin((sliceEndAngle - 90) * (Math.PI / 180));

          const labelX =
            cx +
            ((outerRadiusSize + innerRadiusValue) / 2) *
            Math.cos(
              ((sliceStartAngle + sliceEndAngle) / 2 - 90) * (Math.PI / 180)
            ) +
            5;
          const labelY =
            cy +
            ((outerRadiusSize + innerRadiusValue) / 2) *
            Math.sin(
              ((sliceStartAngle + sliceEndAngle) / 2 - 90) * (Math.PI / 180)
            ) +
            5;

          const baseFontSize = 8; // Set your base font size
          const fontSize = outerRadiusSize * 0.1 + baseFontSize;

          sliceStartAngle = sliceEndAngle + paddingAngle;

          return {
            labelX,
            labelY,
            startX,
            startY,
            endX,
            endY,
            innerStartX,
            innerStartY,
            innerEndX,
            innerEndY,
            largeArcFlag,
            slicePercentage,
            sliceAngle,
            arcLabel,
            fontSize,
            value: val.value,
            label: val.label,
            color: val.color,
            outerRadius: outerRadiusSize,
            innerRadius: innerRadiusValue,
          };
        }

        //#endregion

        return {
          x,
          y,
          ogX: val.x ?? null,
          ogY: val.y ?? null,
          value: d.label,
        };
      })
      .filter((x) => type === 'scatter' || type === 'line' ? x.x !== null && x.y !== null : true);
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <title></title>
      <desc></desc>

      {type === "line" && (
        <g
          style={{
            shapeRendering: "crispEdges",
            transition: "opacity 0.2s ease-in 0s, fill 0.2s ease-in 0s",
          }}
          transform={`translate(${margin.left}, 0)`}
        >
          {pointData
            .filter((_, i) => dataSeries[i]["area"])
            .map((d, i) => {
              const points: [number, number][] = d.map((val) => [val.x, val.y]);
              const catmull = drawCatmullRomChart(points);

              let catmullfilled =
                catmull
                  .map(
                    ({ x, y }, index) => `${index == 0 ? "M" : "L"} ${x} ${y}`
                  )
                  .join(" ") +
                `${dataSeries[i]["area"]
                  ? ` V${height - margin.bottom} H0 Z`
                  : ""
                }`;

              return (
                <g key={`filled-area-${i}`}>
                  <path
                    d={catmullfilled}
                    fill={dataSeries[i].color}
                    fillOpacity={0.1}
                  />
                </g>
              );
            })}
        </g>
      )}

      {type === "bar" && (
        <g
          style={{
            shapeRendering: "crispEdges",
            transition: "opacity 0.2s ease-in 0s, fill 0.2s ease-in 0s",
          }}
          transform={`translate(${margin.left}, 0)`}
        >

          {/* Bar Chart */}
          {[...xAxisData, ...yAxisData]
            .filter((x) => x.scaleType === "band")
            .map((axis) => {
              const isXAxis = axis.position === "bottom" || axis.position === "top";
              return Object.values(groupBy(pointData.flatMap((points) => points), isXAxis ? 'groupX' : 'groupY')).map((group, groupIndex) => {
                return (
                  <g key={`BarChart-Group-${groupIndex}`} transform={`translate(${group[0].groupX}, ${group[0].groupY})`}>
                    {group.map(({ value, color, x, y, width, height }, barIndex) => {
                      return (
                        <rect
                          key={`group-${groupIndex}-bar-${barIndex}`}
                          data-value={value}
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          fill={color}
                        />
                      )
                    })}
                  </g>
                )
              })
            })}
        </g>
      )}

      {/* X-Axis & Y-Axis */}
      {type !== "pie" &&
        [...xAxisData, ...yAxisData].map(
          ({
            position,
            axisValues,
            disableLine,
            disableTicks,
            scaleType,
            label,
          }) => {
            const isXAxis = position === "bottom" || position === "top";
            return (
              <g
                key={`${isXAxis ? "x" : "y"}-axis-${position}`}
                transform={`translate(${position == "left"
                  ? margin.left
                  : position === "right"
                    ? width - margin.right
                    : 0
                  }, ${position === "bottom"
                    ? height - margin.bottom
                    : position === "top"
                      ? margin.top
                      : 0
                  })`}
              >
                {!disableLine && (
                  <line
                    x1={
                      isXAxis
                        ? margin.left
                        : 0
                    }
                    x2={
                      isXAxis
                        ? width - margin.right
                        : 0
                    }
                    y1={
                      isXAxis ? 0 : margin.top
                    }
                    y2={
                      isXAxis ? 0 : height - margin.bottom
                    }
                    className="stroke-black stroke-1 dark:stroke-white"
                    style={{ shapeRendering: "crispEdges" }}
                  />
                )}

                {axisValues.map(
                  (
                    {
                      value,
                      x,
                      y,
                      xLine,
                      yLine,
                      xText,
                      yText,
                      textAnchor,
                      dominantBaseline,
                    },
                    index
                  ) => (
                    <g
                      key={`${position === "bottom" || position === "top" ? "x" : "y"
                        }-axis-${position}-${index} `}
                      transform={`translate(${x}, ${y})`}
                      className="text-xs font-normal tracking-wide"
                    >
                      {!disableTicks && (
                        <line
                          x2={xLine}
                          y2={yLine}
                          className="stroke-black dark:stroke-white"
                          style={{ shapeRendering: "crispEdges" }}
                        />
                      )}

                      <text
                        stroke="none"
                        x={xText}
                        y={yText}
                        transform-origin={`${xText}px ${yText}px`}
                        textAnchor={textAnchor}
                        dominantBaseline={dominantBaseline}
                        className="fill-black text-xs font-normal tracking-wide dark:fill-white"
                      >
                        <tspan x={xText} dy="0">
                          {scaleType === "band" || scaleType === "point"
                            ? value
                            : formatNumber(value, { notation: "compact" })}
                        </tspan>
                      </text>
                    </g>
                  )
                )}

                {label && (
                  <text
                    stroke="none"
                    x={
                      isXAxis ? width / 2 : 0
                    }
                    y={
                      isXAxis ? margin.bottom / 2 + 5 : height / 2
                    }
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-black text-xs font-normal tracking-wide dark:fill-white"
                  >
                    <tspan
                      x={
                        isXAxis
                          ? width / 2
                          : 0
                      }
                      dy="0"
                    >
                      {label}
                    </tspan>
                  </text>
                )}
              </g>
            )
          }
        )}

      {/* Points, Paths, Bars */}
      {(type === "scatter" || type === "line" || type === "pie") && (
        <g
          style={{
            shapeRendering: "crispEdges",
            transition: "opacity 0.2s ease-in 0s, fill 0.2s ease-in 0s",
          }}
          transform={`translate(${margin.left}, 0)`}
          pointerEvents={"all"}
        >
          <rect
            x="0"
            y={margin.top}
            width={availableWidth}
            height={availableHeight}
            fill="none"
            pointerEvents={"none"}
          />

          {type === "scatter" &&
            pointData.map((points, i) =>
              points.map((point, idx) => {
                return (
                  <circle
                    key={`data-${i}-circle-${idx}`}
                    transform={`translate(${point.x}, ${point.y})`}
                    data-value={`(${point.ogX}, ${point.ogY})`}
                    data-serie={point.label}
                    cx={0}
                    cy={0}
                    fill={dataSeries[i].color}
                    r={4}
                    shapeRendering={"auto"}
                    strokeLinecap="round"
                  />
                );
              })
            )}

          {type === 'line' && pointData.map((d, i) => {
            const points: [number, number][] = d.map((val) => [val.x, val.y]);
            const catmull = drawCatmullRomChart(points);

            let catmullpath = catmull
              .map((val, index) => {
                return `${index == 0 ? "M" : "L"} ${val.x} ${val.y}`;
              })
              .join(" ");

            return (
              <g key={`line-${i}`}>
                <path
                  d={catmullpath}
                  stroke={dataSeries[i].color}
                  fill={"none"}
                  style={{
                    strokeWidth: "2px",
                    strokeLinejoin: "round",
                    shapeRendering: "auto",
                  }}
                />
                {d
                  .filter((_, idx) => {
                    const showMark = dataSeries[i]["showMark"];
                    return typeof showMark === "function"
                      ? showMark({ index: idx })
                      : showMark !== false;
                  })
                  .map((point, index) => (
                    <circle
                      key={`data-${i}-circle-${index}`}
                      transform={`translate(${point.x}, ${point.y})`}
                      fillOpacity={0.3}
                      cx={0}
                      cy={0}
                      fill={dataSeries[i].color}
                      r={5}
                      shapeRendering={"auto"}
                      stroke={dataSeries[i].color}
                      strokeLinecap="round"
                      strokeWidth={2}
                    />
                  ))}
              </g>
            );
          })}

          {type === "pie" &&
            pointData.map((pies, i) =>
              pies.map(
                (
                  {
                    startX,
                    startY,
                    endX,
                    endY,
                    label,
                    value,
                    outerRadius,
                    innerRadius,
                    largeArcFlag,
                    innerStartX,
                    innerStartY,
                    innerEndX,
                    innerEndY,
                    arcLabel,
                    color,
                    labelX,
                    labelY,
                    fontSize,
                    slicePercentage,
                  },
                  idx
                ) => {
                  return (
                    <g key={`serie-${i}-slice-${idx}`}>
                      <path
                        shapeRendering={"auto"}
                        data-value={value}
                        data-serie={label}
                        d={`
                          M ${startX} ${startY}
                          A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}
                          L ${innerEndX} ${innerEndY}
                          A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}
                          Z
                        `}
                        fill={color}
                      ></path>
                      {arcLabel && (
                        <text
                          x={labelX}
                          y={labelY}
                          textAnchor="middle"
                          pointerEvents={"none"}
                          textRendering={"auto"}
                          className="pointer-events-none select-none fill-black dark:fill-white"
                          alignmentBaseline="middle"
                          fontSize={fontSize}
                        >
                          {slicePercentage.toFixed(1)}%
                        </text>
                      )}
                    </g>
                  );
                }
              )
            )}
        </g>
      )}

      {/* Legends / Labels */}
      <g>
        {dataSeries
          .filter((s) => (type === "pie" ? true : s.label))
          .map((serie, i) => {
            const x =
              type === "pie"
                ? width / 2 + width / 4
                : margin.left + (availableWidth / series.length) * i;
            const y =
              type === "pie"
                ? availableHeight / 2 - margin.bottom - margin.top
                : 25;
            let yOffset = y; // Offset to position labels underneath each other

            return (
              <g key={`legend-${i}`} transform={`translate(${x}, ${y})`}>
                {type === "pie" ? (
                  serie.data
                    .filter((d) => d["label"])
                    .map((slice, index) => {
                      const { label, color } = slice as ArrayElement<
                        PieChartSeries["data"]
                      >;
                      const labelY = yOffset;
                      yOffset += 30; // You can adjust this value to control vertical spacing
                      return (
                        <g
                          key={`serie-${i}-slice-${index}`}
                          transform={`translate(0, ${labelY})`}
                        >
                          <rect
                            x={0}
                            y={-8}
                            width={16}
                            height={16}
                            fill={color}
                          />
                          <text
                            x={24}
                            y={0}
                            textAnchor="start"
                            dominantBaseline="middle"
                            className="fill-black dark:fill-white"
                          >
                            {label}
                          </text>
                        </g>
                      );
                    })
                ) : (
                  <>
                    <rect
                      x={0}
                      y={-10}
                      width={20}
                      height={20}
                      fill={serie.color}
                    />
                    <text
                      x={25}
                      y={0}
                      textAnchor="start"
                      dominantBaseline="middle"
                      className="fill-black align-middle text-sm font-normal capitalize tracking-wide dark:fill-white"
                    >
                      {serie.label}
                    </text>
                  </>
                )}
              </g>
            );
          })}
      </g>
    </svg>
  );
};

export default Chart;