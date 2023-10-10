import { ReactNode, useEffect, useRef } from "react";
import Tooltip from "../Tooltip/Tooltip";
import { formatNumber } from "src/lib/formatters";

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
      const t3 = t * t2;
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
              `${height -
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

type ChartContainerProps = {
  xAxis?: {
    data?: string[] | number[];
    label?: string;
    scaleType?: "linear" | "log" | "time" | "band" | "point" | "ordinal";
    dataKey?: string;
    valueFormatter?: (value: string | number) => string;
  }[];
  yAxis?: {
    id?: string;
    data?: string[] | number[];
    label?: string;
    scaleType?: "linear" | "log" | "time" | "band" | "point" | "ordinal";
    valueFormatter?: (value: string | number) => string;
  }[];
  dataset?: {
    [key: string]: number | string;
  }[];
  series?: {
    dataKey?: string;
    label?: string;
    data?: number[];
    type?: "line" | "bar" | "pie";
    yAxisId?: string; // One of yAxis ids
    color?: string;
  }[];
  width?: number;
  height?: number;
};

export const ChartContainer = ({
  xAxis,
  yAxis,
  series,
  dataset,
  width = 600,
  height = 400,
}: ChartContainerProps) => {
  const paddingX = 50;
  const paddingY = 50;
  const labelsNumber = dataset
    ? xAxis.map(d => d.dataKey).length
    : xAxis.map(d => d.data.length).reduce((partialSum, a) => partialSum + a, 0);
  const labelStep = (width - paddingX * 2) / labelsNumber;
  const barGap = 3;
  const barSeriesGap = 10;
  const max = Math.max(...series.flatMap((d) => d?.data ? d.data :
    dataset.flatMap((s) =>
      Object.entries(s).filter(([k, v]) => k == d.dataKey || "")
        .map(([_, v]) => parseInt(v.toString())))), 0);
  const min = Math.min(...series.flatMap((d) => d?.data ? d.data :
    dataset.flatMap((s) =>
      Object.entries(s).filter(([k, v]) => k == d.dataKey || "")
        .map(([_, v]) => parseInt(v.toString())))), 0);

  const createEvenAxisRange = (min: number, max: number, stepSize: number = 0.5) => {
    const range = [];
    for (let i = min; i <= max + stepSize; i += stepSize) {
      range.push(i);
    }
    return range;
  }
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <title>test</title>
      <desc>test</desc>

      {/* Bars */}
      <g clipPath="url(#:r30:-clip-path)" style={{ shapeRendering: 'crispEdges', transition: 'opacity 0.2s ease-in 0s, fill 0.2s ease-in 0s' }}>
        {/* {xAxis?.map((axis, axisIndex) => {
          return axis?.data.map((group, index) => {
            const groupX = paddingX + index * labelStep;
            return series.map((serie, serieindex) => {
              const barHeight = ((serie.data[index] - min) / (max - min)) * (height - 2 * paddingY);
              let barWidth = (labelStep / series.length - barGap);
              let x = groupX + serieindex * (barWidth + barGap);

              // Add gap between groups
              x += serieindex == 0 ? barSeriesGap : 0;
              x -= serieindex == series.length - 1 ? barSeriesGap : 0;
              // Add gap between the bars in same group
              x += serieindex * barGap;
              barWidth -= barSeriesGap;

              const y = height - paddingY - barHeight;

              return (
                <rect
                  data-value={serie.data[index]}
                  x={x}
                  y={y}
                  height={barHeight}
                  width={barWidth}
                  style={{ fill: serie.color || 'white', stroke: 'none' }}
                />
              )
            })
          })
        })} */}
      </g>

      {/* X-Axis Labels */}
      {xAxis?.length > 0 && (
        <g
          transform={`translate(0, ${height - paddingY})`}
          className="MuiChartsAxis-root MuiChartsAxis-directionX MuiChartsAxis-bottom css-1da9t35"
        >
          <line
            x1={paddingX}
            x2={width - paddingX}
            className="stroke-1 stroke-white"
            style={{ shapeRendering: 'crispEdges' }}
          />
          {xAxis?.map((axis) => {
            let labels = [];
            const labelsNumber = xAxis.map(d => dataset ? dataset.length : d?.data.length).reduce((partialSum, a) => partialSum + a, 0);
            const labelStep = (width - paddingX * 2) / (labelsNumber);
            for (let i = 0; i <= labelsNumber; i++) {
              const x = paddingX + i * labelStep;

              labels.push(
                <g
                  key={`x-axis-${i}`}
                  transform={`translate(${x}, 0)`}
                  className="MuiChartsAxis-tickContainer text-white"
                >
                  <line
                    y2="6"
                    className="MuiChartsAxis-tick css-1akpp5l stroke-white"
                    style={{ shapeRendering: 'crispEdges' }}
                  />
                  {(axis?.dataKey && dataset && dataset[i]) && (
                    <text
                      // Center text in the middle of the tick
                      x={+labelStep / 2}
                      stroke="none"
                      fill="white"
                      y="9"
                      transform-origin={`0px 0px`}
                      textAnchor="middle"
                      dominantBaseline="hanging"
                      className="text-xs font-normal tracking-wide"
                    >
                      {dataset ? dataset[i][axis.dataKey] : axis?.data[i]}
                    </text>
                  )}
                </g>
              );
            }
            return labels;
          })}
        </g>
      )}

      {/* Y-Axis */}
      {xAxis?.length > 0 && (
        <g
          transform={`translate(${paddingX}, 0)`}
          height={height}
          capHeight={height - paddingY}
          className="MuiChartsAxis-root MuiChartsAxis-directionX MuiChartsAxis-bottom css-1da9t35"
        >
          <line
            // TODO: set y1 to the max value
            y1={paddingY}
            y2={height - paddingY}
            className="stroke-1 stroke-white"
            style={{ shapeRendering: 'crispEdges' }}
          />
          {/* TODO: adjust stepsize automatically */}
          {createEvenAxisRange(min, max, 50).sort((a, b) => b - a).reverse().map((value, idx) => {
            const y = height -
              paddingY -
              ((value - min) / (max - min)) * (height - 2 * paddingY);

            const valueFormatter = (value) => {
              if (value > 1000) {
                return `${value / 1000}k`;
              }
              return value;
            }
            return (
              <g
                key={`y-axis-${value}`}
                transform={`translate(0, ${y})`}
                className="text-xs text-white font-normal tracking-wide"
              >
                <line x2="-6" className="MuiChartsAxis-tick css-1akpp5l stroke-white" style={{ shapeRendering: 'crispEdges' }}></line>
                <text
                  x="-8"
                  stroke="none"
                  fill="white"
                  y="0"
                  transform-origin="-8px 0px"
                  textAnchor="end"
                  dominantBaseline="central"
                  className="MuiChartsAxis-tickLabel text-end"
                >
                  {formatNumber(valueFormatter(value),
                    { maximumSignificantDigits: 2, compactDisplay: 'short' }
                  )}
                </text>
              </g>
            )
          })}
          {yAxis?.filter(y => y.label).map((axis) => {

            const barHeight = ((3 - min) / (max - min)) * (height - 2 * paddingY)
            const maxY = height -
              paddingY -
              (((max - min) - min) / (max - min)) * (height - 2 * paddingY);

            return (
              <text
                key={`y-axis-label-${axis.label}`}
                x={maxY - barHeight / 2}
                y="-30px"
                dominantBaseline="auto"
                textAnchor="middle"
                className="text-sm fill-white font-normal stroke-none transform -rotate-90"
              >
                {axis.label}
              </text>
            )
          })}
        </g>
      )}
      {series && (
        <g className="transform translate-y-4 fill-white" transform={`translate(${paddingX}, 0)`}>
          {series.filter(f => f.dataKey)?.map((serie, index) => {
            return (
              <g key={`legend-${serie.dataKey}`} className="inline-flex items-center space-x-2" transform={`translate(${paddingX + (((width - 2 * paddingX) / series.length) * index)}, 0)`}>
                <rect width="12" height="12" fill={"#ff0000"} />
                <text className="text-base font-normal tracking-wide fill-white transform translate-x-4 align-middle capitalize translate-y-1" dominantBaseline="central">{serie.label}</text>
              </g>
            )
          })}
        </g>
      )}

      <clipPath id=":r30:-clip-path">
        <rect x={paddingX} y="0" width={width} height={height} />
      </clipPath>
    </svg>
  );
};
