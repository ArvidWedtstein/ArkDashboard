import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrayElement,
  IntRange,
  debounce,
  drawCatmullRomChart,
  formatNumber,
  generateChartColors,
  svgArc,
} from "src/lib/formatters";
import Tooltip from "../Tooltip/Tooltip";

interface ChartProps {
  labels: string[];
  data: number[];
  width?: number;
  height?: number;
  title?: string;
  type?: "line" | "bar" | "pie";
  options?: {
    horizontalLines?: boolean;
    verticalLines?: boolean;
    verticalLabels?: boolean;
    horizontalLabels?: boolean;
    lineAnimation?: boolean;
  };
  className?: string;
}
const Chart = ({
  width = 460,
  height = 260,
  labels,
  data,
  title,
  type,
  options = {
    horizontalLines: true,
    verticalLines: false,
    verticalLabels: false,
    horizontalLabels: true,
    lineAnimation: true,
  },
  className,
}: ChartProps) => {
  const chartRef = useRef(null);
  useEffect(() => {
    // Create an SVG element to render the chart
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", `${width + 40}`);
    svg.setAttribute("height", `${height + 40}`);
    svg.setAttribute("class", `group`);
    chartRef.current.innerHTML = "";
    chartRef.current.appendChild(svg);

    // Set up the chart dimensions
    const margin = 20; // Margin around the chart
    const xAxisInterval = (width - 2 * margin) / (labels.length - 1); // Interval between x-axis points
    const yAxisMax = Math.max(...data); // Maximum value in the data
    const yAxisMin = Math.min(...data); // Minimum value in the data
    const yAxisRange = yAxisMax - yAxisMin; // Range of the y-axis values

    // Function to map data points to chart coordinates
    const mapPoint = (x: number, y: number): [number, number] => {
      const xCoord = margin + x * xAxisInterval;
      const yCoord =
        height - margin - ((y - yAxisMin) / yAxisRange) * (height - 2 * margin);
      return [xCoord, yCoord];
    };

    // Function to calculate the Catmull-Rom interpolation
    const catmullRomInterpolation = (
      p0: number,
      p1: number,
      p2: number,
      p3: number,
      t: number
    ): number => {
      const t2 = t * t;
      const t3 = t2 * t;
      return (
        0.5 *
        (2 * p1 +
          (-p0 + p2) * t +
          (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
          (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
      );
    };

    // Function to generate the smooth line using Catmull-Rom interpolation
    const generateSmoothLine = (points: [number, number][]): string => {
      const pathSegments = ["M", points[0][0], points[0][1]];

      for (let i = 1; i < points.length - 2; i++) {
        const p0 = points[i - 1] || points[0];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || points[points.length - 1];

        for (let t = 0; t < 1; t += 0.05) {
          const x = catmullRomInterpolation(p0[0], p1[0], p2[0], p3[0], t);
          const y = catmullRomInterpolation(p0[1], p1[1], p2[1], p3[1], t);
          pathSegments.push("L", x, y);
        }
      }

      pathSegments.push(
        "L",
        points[points.length - 1][0],
        points[points.length - 1][1]
      );

      return pathSegments.join(" ");
    };

    const line = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      stroke: string = "#dddddd"
    ) => {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", `${x1}`);
      line.setAttribute("y1", `${y1}`);
      line.setAttribute("x2", `${x2}`);
      line.setAttribute("y2", `${y2}`);
      line.setAttribute("stroke", stroke);
      return line;
    };
    // const group = (transform?: string,) => {
    //   const group = document.createElementNS(
    //     "http://www.w3.org/2000/svg",
    //     "g"
    //   );
    //   group.
    // }
    // Function to render the chart
    const renderChart = (): void => {
      // Clear any existing chart
      svg.innerHTML = "";

      // Create a group for the chart content
      const chartGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      chartGroup.setAttribute("transform", `translate(${margin}, ${margin})`);
      svg.appendChild(chartGroup);

      // Draw x-axis
      const xAxis = line(0, height, width, height);
      chartGroup.appendChild(xAxis);

      // Draw y-axis
      const yAxis = line(0, -20, 0, height);
      chartGroup.appendChild(yAxis);

      // Draw data points and smooth line
      const labelGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      labelGroup.setAttribute("width", "100%");
      labelGroup.setAttribute("height", "100%");
      labelGroup.setAttribute("transform", `translate(0, 0)`);

      chartGroup.appendChild(labelGroup);

      const max = Math.max(...data);
      const min = Math.min(...data);
      const lineGroupY = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      lineGroupY.setAttribute("transform", `translate(0, 0)`);
      lineGroupY.setAttribute("width", "100%");
      lineGroupY.setAttribute("height", "100%");
      labelGroup.appendChild(lineGroupY);

      let mx = max + (max - min > 10 ? 1 : 0.5);
      if (options?.verticalLabels || options.horizontalLines) {
        for (let i = min; i <= mx; i += max - min > 10 ? 1 : 0.5) {
          if (options?.verticalLabels) {
            const labelY = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "text"
            );
            labelY.setAttribute("x", `-15`);
            labelY.setAttribute(
              "y",
              `${
                height -
                margin -
                ((i - yAxisMin) / yAxisRange) * (height - 2 * margin)
              }`
            );
            labelY.setAttribute("font-size", `${max - min > 10 ? 12 : 8}`);
            labelY.setAttribute("textAnchor", "right");
            labelY.setAttribute("alignment-baseline", "middle");
            labelY.setAttribute("fill", "white");
            labelY.textContent = i.toFixed(1).toString();
            lineGroupY.appendChild(labelY);
          }

          if (options?.horizontalLines) {
            const yLine = line(
              0,
              height -
                margin -
                ((i - yAxisMin) / yAxisRange) * (height - 2 * margin),
              width,
              height -
                margin -
                ((i - yAxisMin) / yAxisRange) * (height - 2 * margin)
            );
            yLine.setAttribute("stroke", "#ffffff");
            yLine.setAttribute("stroke-opacity", "0.2");
            yLine.setAttribute("z-index", "-1");
            yLine.setAttribute("stroke-width", "0.5");
            yLine.setAttribute(
              "class",
              `transition-all duration-300 ease-in-out animate-fly-in`
            );
            lineGroupY.appendChild(yLine);
          }
        }
      }

      const points: [number, number][] = [];
      for (let i = 0; i < labels.length; i++) {
        if (i == 0) {
          const [_, y] = mapPoint(0, data[i]);
          points.push([0, y]);
        }
        const [x, y] = mapPoint(i, data[i]);
        points.push([x, y]);

        if (i == labels.length - 1) points.push([width, height]);

        const lineGroupX = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );
        lineGroupX.setAttribute("transform", `translate(${x}, 0)`);
        lineGroupX.setAttribute("width", "100%");
        lineGroupX.setAttribute("height", "100%");

        if (options.horizontalLabels) {
          const labelX = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          labelX.setAttribute("x", `0`);
          labelX.setAttribute("y", `${height + margin - 5}`);
          labelX.setAttribute("font-size", "12");
          labelX.setAttribute("text-anchor", "middle");
          labelX.setAttribute("fill", "white");
          labelX.textContent = labels[i];
          lineGroupX.appendChild(labelX);
        }

        if (options.verticalLines) {
          const yLine = line(0, height, 0, -20, "#ffffff");
          yLine.setAttribute("stroke-opacity", "0.2");
          lineGroupX.appendChild(yLine);
        }

        labelGroup.appendChild(lineGroupX);

        const dataPoint = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        dataPoint.setAttribute("cx", `${x}`);
        dataPoint.setAttribute("cy", `${y}`);
        dataPoint.setAttribute("r", "3");
        dataPoint.setAttribute("fill", "#12d393");
        dataPoint.setAttribute("stroke", "none");
        // dataPoint.setAttribute("title", `${labels[i]}: ${data[i]}`);
        dataPoint.setAttribute("class", ` transition-all duration-300`);

        chartGroup.appendChild(dataPoint);
      }

      const smoothLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      smoothLine.setAttribute("d", generateSmoothLine(points));
      smoothLine.setAttribute("stroke", "#26934f");
      smoothLine.setAttribute("fill", "none");
      smoothLine.setAttribute("strokeWidth", "1");

      if (options.lineAnimation) {
        smoothLine.setAttribute(
          "stroke-dasharray",
          `${smoothLine.getTotalLength()} ${smoothLine.getTotalLength()}`
        );
        smoothLine.setAttribute(
          "stroke-dashoffset",
          `${smoothLine.getTotalLength()}`
        );

        smoothLine.style.animation = `chartLineAnimation 3s ease-out forwards`;

        // Add keyframes for the animation
        const style = document.createElement("style");
        style.textContent = `
      @keyframes chartLineAnimation {
        from {
          stroke-dashoffset: ${smoothLine.getTotalLength()};
        }
        to {
          stroke-dashoffset: 0;
        }
      }
    `;
        document.head.appendChild(style);
      }
      smoothLine.setAttribute("class", `transition-all duration-300`);
      chartGroup.appendChild(smoothLine);

      const gradient = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "linearGradient"
      );
      gradient.setAttribute("id", "chartGradient");
      gradient.setAttribute("gradientUnits", "userSpaceOnUse");
      gradient.setAttribute("x1", "0");
      gradient.setAttribute("y1", `0`);
      gradient.setAttribute("x2", "0");
      gradient.setAttribute("y2", `${height}`);
      chartGroup.appendChild(gradient);

      // Add gradient stops
      const gradientStop1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );
      gradientStop1.setAttribute("offset", "0");
      gradientStop1.setAttribute("stop-color", "#34b364");
      gradientStop1.setAttribute("stop-opacity", "0.2");
      gradient.appendChild(gradientStop1);

      const gradientStop2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );
      gradientStop2.setAttribute("offset", "1");
      gradientStop2.setAttribute("stop-color", "#34b364");
      gradientStop2.setAttribute("stop-opacity", "0.2");
      gradient.appendChild(gradientStop2);

      // Create filled area
      const filledArea = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      const areaPath = `${smoothLine.getAttribute("d")} V${height} H0 Z`;
      filledArea.setAttribute("d", areaPath);
      filledArea.setAttribute("fill", "url(#chartGradient)");
      filledArea.setAttribute("fill-opacity", "1");
      chartGroup.appendChild(filledArea);
    };

    // Call the renderChart function to generate the chart
    renderChart();
  }, []);
  return (
    <div className={className}>
      {title && (
        <h1 className="m-1 mb-0 w-full text-center text-white">{title}</h1>
      )}
      <div ref={chartRef}></div>
    </div>
  );
};

export default Chart;

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

const generateLabelsAxisRange = (
  axisData: AxisData,
  chartData: ChartContainerProps & {
    paddingX: number;
    paddingY: number;
  },
  isXAxis: boolean = true,
  centerText: boolean = true
) => {
  const { width, height, paddingX, paddingY, dataset } = chartData;

  const labelsNumber =
    axisData.reduce(
      (partialSum, axis) => partialSum + (axis?.data.length || 0),
      0
    ) - (centerText ? 0 : 1);
  const labelStep =
    (isXAxis ? width - paddingX * 2 : height - paddingY * 2) / labelsNumber;

  return axisData?.map((axis, index) => {
    const labels = [];

    for (let i = 0; i <= labelsNumber; i++) {
      const xy = (isXAxis ? paddingX : paddingY) + i * labelStep;

      labels.push(
        <g
          key={`${isXAxis ? "x" : "y"} - axis - ${i} `}
          transform={`translate(${isXAxis ? xy : 0}, ${isXAxis ? 0 : xy})`}
          className="text-white"
        >
          <line
            y2={`${isXAxis ? 6 : 0}px`}
            x2={`${isXAxis ? 0 : -6}px`}
            className="stroke-white"
            style={{ shapeRendering: "crispEdges" }}
          />
          {((axis?.dataKey && dataset && dataset[i]) ||
            (i >= 0 && i < labelsNumber) ||
            !centerText) && (
            <text
              // Center text in the middle of the tick
              x={`${isXAxis ? (centerText ? labelStep / 2 : 0) : -8}px`}
              y={`${isXAxis ? 9 : centerText ? labelStep / 2 : 0}px`} // +labelStep / 2 to center text
              stroke="none"
              fill="white"
              transform-origin={`${isXAxis ? 0 : -8}px 0px`}
              textAnchor={isXAxis ? "middle" : "end"}
              dominantBaseline={isXAxis ? "hanging" : "central"}
              className="text-xs font-normal tracking-wide"
            >
              {dataset && dataset.length > 0 && i < dataset.length
                ? dataset[i][axis.dataKey]
                : axis?.data[i]
                ? axis?.data[i]
                : i.toString() ?? ""}
            </text>
          )}
        </g>
      );
    }
    return labels;
  });
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

    console.log(logMax, logMin, range);
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
    scaleType === "point" ? data.length - 1 : data.length || 0;

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

  // console.log(`1: ${stepSize} VS 2: ${calculateStepSize()}`)

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
        (isFinite(min) ? min - (min % stepMultiplier) : 0) +
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
        yText: isHorizontal ? (disableTicks ? 7 : 3 + tickSize) : 0,
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

/**
 * TODO: Add support for log scale
 * Generates the numbers and lines for the axis
 * @param isXAxis
 * @returns
 */
const generateAxisRange = (
  chartData: ChartContainerProps & {
    xAxisData?: AxisData;
    yAxisData?: AxisData;
    max: number;
    min: number;
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  },
  scaleType = "linear",
  position: AxisPosition = "bottom"
) => {
  let availableWidth =
    chartData.width - chartData.margin.left - chartData.margin.right;
  let availableHeight =
    chartData.height - chartData.margin.top - chartData.margin.bottom;
  return generateAxisRangeValues(
    { availableWidth, availableHeight, ...chartData },
    scaleType,
    position,
    6,
    false
  ).map((axisValue) => {
    return (
      <g
        key={`${position === "top" || position === "bottom" ? "x" : "y"}-axis-${
          axisValue.value
        } `}
        transform={`translate(${axisValue.x}, ${axisValue.y})`}
        className="text-xs font-normal tracking-wide"
      >
        <line
          x2={axisValue.xLine}
          y2={axisValue.yLine}
          className="stroke-black dark:stroke-white"
          style={{ shapeRendering: "crispEdges" }}
        />
        <text
          // +labelStep / 2 to center text
          stroke="none"
          x={axisValue.xText}
          y={axisValue.yText}
          transform-origin={`${axisValue.xText}px ${axisValue.yText}px`}
          textAnchor={axisValue.textAnchor}
          dominantBaseline={axisValue.dominantBaseline}
          className="fill-black text-xs font-normal tracking-wide dark:fill-white"
        >
          <tspan x={axisValue.xText} dy="0">
            {formatNumber(axisValue.value, { notation: "compact" })}
          </tspan>
        </text>
      </g>
    );
  });
};

export const ChartContainer = ({
  xAxis,
  yAxis,
  series = [],
  dataset = [],
  width = 600,
  height = 400,
  ...props
}: ChartContainerProps) => {
  // Autogenerate unique hex colors
  const colors = generateChartColors([...Array(series.length)].length);

  const dataSeries = series?.map((s) => {
    return {
      ...s,
      color: s?.color || colors[series.indexOf(s)],
      data:
        (dataset.length > 0
          ? dataset?.map((d) => parseInt(d[s.dataKey].toString()))
          : s.data) ?? [],
    };
  });

  const xAxisData = xAxis
    ?.filter((x) => x.scaleType != null)
    ?.map((x) => {
      return {
        ...x,
        data:
          dataset && dataset.length > 0
            ? dataset?.map((d) => d[x.dataKey])
            : x.data,
      };
    }) ?? [{ data: [...Array(series.length)].map((_, i) => i) }];

  const yAxisData =
    yAxis
      ?.filter((y) => y.scaleType != null)
      ?.map((y) => {
        return {
          ...y,
          data:
            dataset && dataset.length > 0
              ? dataset?.map((d) => d[y.dataKey])
              : y.data,
        };
      }) || [];

  const paddingX = 50;
  const paddingY = 50;

  const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  };
  const categoryGapRatio = 0.5;
  const barGapRatio = 0.1;

  const max = Math.max(...dataSeries.flatMap((d) => d?.data));
  const min = Math.min(...dataSeries.flatMap((d) => d?.data), 0);

  const calculateBarDimensions = (isXAxis: boolean = true) => {
    // Determine the number of data points and categories
    const numDataPoints = dataSeries.length;
    const numCategories = dataSeries[0]?.data.length;

    // Calculate the width of a single category and single bar based on orientation
    const totalWidth = isXAxis
      ? width - margin.left - margin.right
      : height - margin.top - margin.bottom;

    const categoryWidth = (totalWidth * (1 - categoryGapRatio)) / numCategories;
    const barWidth = (categoryWidth * (1 - barGapRatio)) / numDataPoints;

    // Initialize an array to store the bar positions
    // Calculate the position of each bar within its category
    const barPositions = Array(numDataPoints)
      .fill(0)
      .map((_, i) => {
        const basePosition = i * (barWidth + barGapRatio * categoryWidth);
        return Array(numCategories)
          .fill(0)
          .map((_, j) => j * categoryWidth + basePosition);
      });

    return { barWidth, barPositions, categoryWidth };
  };

  const generateBars = (isXAxis: boolean = true) => {
    const axisData = isXAxis ? xAxisData : yAxisData;

    const { barWidth, barPositions, categoryWidth } =
      calculateBarDimensions(isXAxis);

    return axisData
      ?.filter((axis) => axis.data.some((data) => data))
      ?.map((axis, axisIndex) => (
        <React.Fragment key={`axis-${axisIndex}`}>
          {dataSeries[0].data.map((_, j) => (
            <g
              transform={`translate(${isXAxis ? j * categoryWidth : 0}, ${
                isXAxis ? 0 : j * categoryWidth
              })`}
              key={`category-${j}`}
            >
              {dataSeries.map((data, i) => {
                const rectWidth = isXAxis
                  ? barWidth
                  : ((data.data[j] - min) / (max - min)) *
                    (width - 2 * paddingX);
                const rectHeight = isXAxis
                  ? ((data.data[j] - min) / (max - min)) *
                    (height - 2 * paddingY)
                  : barWidth;

                const x = isXAxis
                  ? Math.round(
                      (barPositions[i][j] + categoryWidth / 2) * 1000
                    ) / 1000
                  : 0;
                const y = isXAxis
                  ? height - paddingY - rectHeight
                  : Math.round(
                      (barPositions[i][j] + paddingY + categoryWidth / 2) * 1000
                    ) / 1000;

                return (
                  <rect
                    key={`bar-${i}-${j}`}
                    data-value={data.data[j]}
                    x={x}
                    y={y}
                    width={rectWidth}
                    height={rectHeight}
                    fill={data.color}
                  />
                );
              })}
            </g>
          ))}
        </React.Fragment>
      ));
  };

  const generateLabels = (isXAxis: boolean = true) => {
    const axisData = isXAxis ? xAxisData : yAxisData;
    return axisData
      ?.filter((xy) => xy.label)
      .map((axis) => {
        const barHeight = ((3 - min) / (max - min)) * (height - 2 * paddingY);
        const maxY =
          height -
          paddingY -
          ((max - min - min) / (max - min)) * (height - 2 * paddingY);

        return (
          <text
            key={`${isXAxis ? "x" : "y"}-axis-label-${axis.label} `}
            x={
              isXAxis
                ? (width - 2 * paddingX) / 2 + paddingX
                : maxY - barHeight / 2
            }
            y={isXAxis ? 40 : -30}
            dominantBaseline="auto"
            textAnchor="middle"
            className={
              "origin-center fill-white stroke-none text-sm font-normal" +
              (isXAxis ? " " : "  -rotate-90 transform")
            }
          >
            {axis.label}
          </text>
        );
      });
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <title></title>
      <desc></desc>

      {/* Bars */}
      <g
        clipPath="url(#:r30:-clip-path)"
        style={{
          shapeRendering: "crispEdges",
          transition: "opacity 0.2s ease-in 0s, fill 0.2s ease-in 0s",
        }}
        transform={`translate(${paddingX}, 0)`}
        // onMouseMove={(e) => {
        //   const target = e.target as HTMLDivElement;
        //   const value = target.getAttribute('data-value');

        //   // if (!value) return
        //   const x = e.clientX;
        //   const y = e.clientY;

        //   // if (document.getElementById('marker')) return;
        //   const markerPath = `M0 ${height - y} L${x} ${height - paddingY} L0 ${height - paddingY} L0 ${height} Z`;
        //   let marker = document.getElementById('marker') ? document.getElementById('marker') : document.createElementNS("http://www.w3.org/2000/svg", "path");
        //   marker.setAttribute("d", markerPath);
        //   marker.setAttribute("fill", "#ffffff");
        //   marker.setAttribute("fill-opacity", "0.2");
        //   marker.style.pointerEvents = 'none';
        //   marker.id = "marker"

        //   e.currentTarget.appendChild(marker);
        // }}
        // onMouseOut={(e) => {
        //   const target = e.currentTarget as SVGGElement;
        //   const marker = document.getElementById('marker');
        //   if (marker) {
        //     target.removeChild(marker);
        //   }
        // }}
      >
        <rect
          x="0"
          y={paddingY}
          width={width - 2 * paddingX}
          height={height - 2 * paddingY}
          fill="none"
        />
        {generateBars(true)}
        {generateBars(false)}
      </g>

      {/* X-Axis Labels */}
      <g transform={`translate(0, ${height - paddingY})`}>
        <line
          x1={paddingX}
          x2={width - paddingX}
          y1={0}
          className="stroke-white stroke-1"
          style={{ shapeRendering: "crispEdges" }}
        />

        {xAxisData.filter((x) => x?.data.length > 0).length > 0
          ? generateLabelsAxisRange(
              xAxisData,
              { width, height, paddingX, paddingY, dataset, series },
              true
            )
          : generateAxisRange(
              { width, height, xAxisData, yAxisData, margin, min, max },
              "linear",
              "bottom"
            )}

        {/* Axis Labels */}
        {generateLabels(true)}
      </g>

      {/* Y-Axis */}
      <g transform={`translate(${paddingX}, 0)`}>
        <line
          y1={paddingY}
          y2={height - paddingY}
          className="stroke-white stroke-1"
          style={{ shapeRendering: "crispEdges" }}
        />

        {yAxisData.filter((y) => y.data.length > 0).length > 0
          ? generateLabelsAxisRange(
              yAxisData,
              { width, height, paddingX, paddingY, dataset, series },
              false
            )
          : generateAxisRange(
              { width, height, xAxisData, yAxisData, margin, min, max },
              "linear",
              "left"
            )}

        {/* Axis Labels */}
        {generateLabels(false)}
      </g>

      {/* Labels */}
      {series && (
        <g
          className="translate-y-4 transform fill-white"
          transform={`translate(${paddingX}, 0)`}
        >
          {dataSeries?.map((serie, index) => {
            return (
              <g
                key={`legend - ${serie?.dataKey || index}`}
                className="inline-flex items-center space-x-2"
                transform={`translate(${
                  paddingX + ((width - 2 * paddingX) / series.length) * index
                }, 0)`}
              >
                <rect width="12" height="12" fill={serie.color} />
                <text
                  className="translate-x-4 translate-y-1 transform fill-white align-middle text-base font-normal capitalize tracking-wide"
                  dominantBaseline="central"
                >
                  {serie.label}
                </text>
              </g>
            );
          })}
        </g>
      )}

      <clipPath id=":r30:-clip-path">
        <rect x={0} y={0} width={width} height={height} />
      </clipPath>
    </svg>
  );
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

export const ScatterChart = ({
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

  const categoryGapRatio = 0.3;
  const barGapRatio = 0.1;

  const AxisPositionMap: { [key: string]: AxisPosition } = {
    [leftAxis]: "left",
    [rightAxis]: "right",
    [topAxis]: "top",
    [bottomAxis]: "bottom",
  };

  // TODO: check if it works vertically
  const generateBars = (axisData: ArrayElement<AxisData>) => {
    const xAxis = xAxisData.find((x) =>
      dataSeries.some((d) => d.xAxisKey == x.id)
    );
    const yAxis = yAxisData.find((y) =>
      dataSeries.some((d) => d.yAxisKey == y.id)
    );
    const isXAxis =
      axisData.position === "bottom" || axisData.position === "top";

    const min = isFinite(axisData.valueMin)
      ? axisData.valueMin
      : isXAxis
      ? yAxis.valueMin
      : xAxis.valueMin;
    const max = isFinite(axisData.valueMax)
      ? axisData.valueMax
      : isXAxis
      ? yAxis.valueMax
      : xAxis.valueMax;

    return axisData.axisValues
      .filter((axis) => axis.isMarkerPoint)
      .map((axisValue, index) => {
        const groupWidth = axisValue.stepSize - (dataSeries.length - 1);

        // Calculate category spacing
        const categorySpacing = groupWidth * categoryGapRatio;

        // Calculate bar width and gap
        const totalBarWidth =
          (groupWidth - categorySpacing) / dataSeries.length;
        const barWidth = totalBarWidth * (1 - barGapRatio);
        const barGap = totalBarWidth * barGapRatio;

        return (
          <g
            data-group={index + 1}
            transform={`translate(${isXAxis ? axisValue.x - margin.left : 0}, ${
              isXAxis ? 0 : axisValue.y - margin.top
            })`}
            key={`category-${index}`}
          >
            {dataSeries.map((data, barIndex) => {
              const rectWidth = isXAxis
                ? barWidth
                : ((data.data[index] - min) / (max - min)) * availableWidth;
              const rectHeight = isXAxis
                ? ((data.data[index] - min) / (max - min)) * availableHeight
                : barWidth;

              const x = isXAxis
                ? Math.round(
                    (barIndex * (barWidth + barGap) + categorySpacing / 2) *
                      1000
                  ) / 1000
                : 0;
              const y = isXAxis ? height - margin.bottom - rectHeight : 0;

              return (
                <rect
                  key={`bar-${barIndex}-${index}`}
                  data-value={data.data[index]}
                  x={x}
                  y={y}
                  width={rectWidth}
                  height={rectHeight}
                  fill={data.color}
                />
              );
            })}
          </g>
        );
      });
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
      scale: scaleType === "log" ? (d) => Math.log10(d + 1) : (d) => d,
      valueMin,
      valueMax,
      position,
      disableLine: x.disableLine ?? false,
      disableTicks: x.disableTicks ?? false,
      tickSize,
    };
  });

  const yAxisData = (yAxis ?? [{ id: "left" }])?.map((x) => {
    let id = x?.id ?? "left";
    let position: AxisPosition = AxisPositionMap[id] || "left";

    let data =
      (dataset.length > 0 && x.dataKey
        ? dataset?.map((d) => parseInt(d[x.dataKey].toString()))
        : x.data) ?? [];

    let scaleType = x.scaleType ?? "linear";
    let tickSize = x.tickSize ?? 6;

    let valueMin =
      x.min ??
      Math.min(
        type === "bar" ? 0 : null,
        ...dataSeries.flatMap((s) =>
          type === "scatter"
            ? s.data.map((x) =>
                position === "top" || position === "bottom" ? x.x : x.y
              )
            : s.data
        ),
        ...(x?.data && x?.data.every((x) => !isNaN(parseInt(x.toString())))
          ? x.data.map((x) => parseInt(x.toString()))
          : [])
      );
    let valueMax =
      x.max ??
      Math.max(
        ...dataSeries.flatMap((s) =>
          type === "scatter"
            ? s.data.map((x) =>
                position === "top" || position === "bottom" ? x.x : x.y
              )
            : s.data
        ),
        ...(x?.data && x?.data.every((x) => !isNaN(parseInt(x.toString())))
          ? x.data.map((x) => parseInt(x.toString()))
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
      x.disableTicks ?? false,
      data
    );

    return {
      ...x,
      id,
      data,
      axisValues,
      scaleType,
      scale: scaleType === "log" ? (d) => Math.log10(d + 1) : (d) => d,
      valueMin,
      valueMax,
      position,
      disableLine: x.disableLine ?? false,
      disableTicks: x.disableTicks ?? false,
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

    const minX = xAxis?.valueMin;
    const maxX = xAxis?.valueMax;

    const minY = yAxis?.valueMin;
    const maxY = yAxis?.valueMax;

    // if (type === "line" && width == 499) console.log(minX, maxX, minY, maxY);

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

    // TODO: add bar
    // TODO: calc for horizontal
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
            : numberToChart(
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
      .filter((x) => x.x !== null && x.y !== null);
  });

  const lineData = {
    filledArea:
      type === "line"
        ? pointData
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
                `${
                  dataSeries[i]["area"]
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
            })
        : [],
    line: pointData.map((d, i) => {
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
        </g>
      );
    }),
    points: pointData.flatMap((d, i) => {
      return d
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
        ));
    }),
  };

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
          {lineData.filledArea}
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
          {[...xAxisData, ...yAxisData]
            .filter((x) => x.scaleType === "band")
            .map((axis) => generateBars(axis))}
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
          }) => (
            <g
              key={`${
                position === "bottom" || position === "top" ? "x" : "y"
              }-axis-${position}`}
              transform={`translate(${
                position == "left"
                  ? margin.left
                  : position === "right"
                  ? width - margin.right
                  : 0
              }, ${
                position === "bottom"
                  ? height - margin.bottom
                  : position === "top"
                  ? margin.top
                  : 0
              })`}
            >
              {!disableLine && (
                <line
                  x1={
                    position === "top" || position === "bottom"
                      ? margin.left
                      : 0
                  }
                  x2={
                    position === "top" || position === "bottom"
                      ? width - margin.right
                      : 0
                  }
                  y1={
                    position === "left" || position === "right" ? margin.top : 0
                  }
                  y2={
                    position === "left" || position === "right"
                      ? height - margin.bottom
                      : 0
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
                    key={`${
                      position === "bottom" || position === "top" ? "x" : "y"
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
                    position === "bottom" || position === "top" ? width / 2 : 0
                  }
                  y={
                    position === "left" || position === "right"
                      ? height / 2
                      : margin.bottom / 2 + 5
                  }
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-black text-xs font-normal tracking-wide dark:fill-white"
                >
                  <tspan
                    x={
                      position === "bottom" || position === "top"
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

          {type === "line" && lineData.line}
          {type === "line" && lineData.points}

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
