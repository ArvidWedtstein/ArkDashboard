import { ReactNode, useEffect, useRef } from "react";
import { formatNumber, groupBy } from "src/lib/formatters";

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


type AxisData = {
  id?: string;
  data?: (string | number)[];
  label?: string;
  scaleType?: "linear" | "log" | "time" | "band" | "point" | "ordinal";
  dataKey?: string;
  valueFormatter?: (value: string | number) => string;
}[]
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


const generateLabelsAxisRange = (axisData: AxisData, chartData: ChartContainerProps & {
  paddingX: number;
  paddingY: number;
}, isXAxis: boolean = true, centerText: boolean = true) => {
  const { width, height, paddingX, paddingY, dataset } = chartData;

  const labelsNumber = axisData.reduce((partialSum, axis) => partialSum + (axis?.data.length || 0), 0) - (centerText ? 0 : 1);
  const labelStep = (isXAxis ? width - paddingX * 2 : height - paddingY * 2) / labelsNumber;

  return axisData?.map((axis, index) => {
    const labels = [];

    for (let i = 0; i <= labelsNumber; i++) {
      const xy = (isXAxis ? paddingX : paddingY) + i * labelStep;

      labels.push(
        <g
          key={`${isXAxis ? 'x' : 'y'} - axis - ${i} `}
          transform={`translate(${isXAxis ? xy : 0}, ${isXAxis ? 0 : xy})`}
          className="text-white"
        >
          <line
            y2={`${isXAxis ? 6 : 0}px`}
            x2={`${isXAxis ? 0 : -6}px`}
            className="stroke-white"
            style={{ shapeRendering: 'crispEdges' }}
          />
          {((axis?.dataKey && dataset && dataset[i]) || (i >= 0 && i < labelsNumber || !centerText)) && (
            <text
              // Center text in the middle of the tick
              x={`${isXAxis ? centerText ? labelStep / 2 : 0 : -8}px`}
              y={`${isXAxis ? 9 : centerText ? labelStep / 2 : 0}px`} // +labelStep / 2 to center text
              stroke="none"
              fill="white"
              transform-origin={`${isXAxis ? 0 : -8}px 0px`}
              textAnchor={isXAxis ? "middle" : 'end'}
              dominantBaseline={isXAxis ? "hanging" : 'central'}
              className="text-xs font-normal tracking-wide"
            >
              {dataset && dataset.length > 0 && i < dataset.length ? dataset[i][axis.dataKey] : axis?.data[i] ? axis?.data[i] : i.toString() ?? ''}
            </text>
          )}
        </g>
      );
    }
    return labels;
  })
}

const numberToChart = (chartData: ChartContainerProps & {
  paddingX: number;
  paddingY: number;
  max: number;
  min: number;
}, value: number, isXAxis: boolean = true): number => {
  const { width, height, paddingX, paddingY, max, min } = chartData;
  return isXAxis
    ? width - paddingX - ((value - min) / (max - min)) * (width - 2 * paddingX)
    : height - paddingY - ((value - min) / (max - min)) * (height - 2 * paddingY);
}

/**
 * Generates the numbers and lines for the axis
 * @param isXAxis
 * @returns
 */
const generateAxisRange = (chartData: ChartContainerProps & {
  paddingX: number;
  paddingY: number;
  max: number;
  min: number;
}, isXAxis: boolean = true) => {
  const { width, height, paddingX, paddingY, max, min } = chartData;

  // Determine the ideal number of steps based on chart height
  const idealStepCount = (isXAxis ? (width - 2 * paddingX) : (height - 2 * paddingY)) / (isXAxis ? (width / width) * 25 : 50);

  // Calculate the raw step size
  const rawStepSize = (max - min) / idealStepCount;

  // Calculate a rounded step size for even steps
  const stepExponent = Math.floor(Math.log10(rawStepSize));
  const stepMultiplier = Math.pow(10, stepExponent);

  const stepSize = max - min <= 10 ? 1 : Math.ceil(rawStepSize / stepMultiplier) * stepMultiplier;

  // Calculate the number of steps based on the rounded step size
  const stepCount = Math.ceil((max - min) / stepSize);

  // Generate yAxis values with even steps
  const axisValues = [];
  for (let i = 0; i <= stepCount; i++) {
    const value = min + i * stepSize;
    const xy = isXAxis ? width - numberToChart(chartData, value, isXAxis) : numberToChart(chartData, value, isXAxis);

    if (xy > 0) {
      axisValues.push(
        <g
          key={`${isXAxis ? 'x' : 'y'}-axis-${value} `}
          transform={`translate(${isXAxis ? xy : 0}, ${isXAxis ? 0 : xy})`}
          className="text-xs font-normal tracking-wide"
        >
          <line x2={isXAxis ? 0 : -6} y2={isXAxis ? 6 : 0} className="stroke-white" style={{ shapeRendering: 'crispEdges' }} />
          <text
            // +labelStep / 2 to center text
            stroke="none"
            x={isXAxis ? 0 : -8}
            y={isXAxis ? 9 : 0}
            transform-origin={`${isXAxis ? 0 : -8}px ${isXAxis ? 9 : 0}px`}
            textAnchor={isXAxis ? 'middle' : 'end'}
            dominantBaseline={isXAxis ? 'hanging' : 'central'}
            className="text-xs font-normal tracking-wide fill-white"
          // style={{ transformOrigin: `${isXAxis ? 0 : -8}px ${isXAxis ? 9 : 0}px` }}
          >
            {formatNumber(value, { notation: 'compact' })}
          </text>
        </g>
      );
    }
  }

  return axisValues;
}

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
  const colors = [...Array(series.length)].map((_, i) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
  });

  const dataSeries = series?.map((s) => {
    return {
      ...s,
      color: s?.color || colors[series.indexOf(s)],
      data: (dataset.length > 0 ? dataset?.map((d) => parseInt(d[s.dataKey].toString())) : s.data) ?? [],
    };
  });

  const xAxisData = xAxis?.filter(x => x.scaleType != null)?.map((x) => {
    return {
      ...x,
      data: dataset && dataset.length > 0 ? dataset?.map((d) => d[x.dataKey]) : x.data
    };
  }) ?? [{ data: [...Array(series.length)].map((_, i) => i) }];

  const yAxisData = yAxis?.filter(y => y.scaleType != null)?.map((y) => {
    return {
      ...y,
      data: dataset && dataset.length > 0 ? dataset?.map((d) => d[y.dataKey]) : y.data,
    };
  }) || [];


  const paddingX = 50;
  const paddingY = 50;
  const categoryGapRatio = 0.5;
  const barGapRatio = 0.1;

  const max = Math.max(...dataSeries.flatMap((d) => d?.data));
  const min = Math.min(...dataSeries.flatMap((d) => d?.data), 0);

  const calculateBarDimensions = (isXAxis: boolean = true) => {
    // Determine the number of data points and categories
    const numDataPoints = dataSeries.length;
    const numCategories = dataSeries[0]?.data.length;

    // Calculate the width of a single category and single bar based on orientation
    const totalWidth = isXAxis ? width - 2 * paddingX : height - 2 * paddingY;

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
  }

  const generateBars = (isXAxis: boolean = true) => {
    const axisData = isXAxis ? xAxisData : yAxisData;

    const { barWidth, barPositions, categoryWidth } = calculateBarDimensions(isXAxis);

    return axisData
      ?.filter((axis) => axis.data.some((data) => data))
      ?.map((axis, axisIndex) => (
        <React.Fragment key={`axis-${axisIndex}`}>
          {dataSeries[0].data.map((_, j) => (
            <g
              transform={`translate(${isXAxis ? j * categoryWidth : 0}, ${isXAxis ? 0 : j * categoryWidth})`}
              key={`category-${j}`}
            >
              {dataSeries.map((data, i) => {
                const rectWidth = isXAxis ? barWidth : ((data.data[j] - min) / (max - min)) * (width - 2 * paddingX);
                const rectHeight = isXAxis ? ((data.data[j] - min) / (max - min)) * (height - 2 * paddingY) : barWidth;

                const x = isXAxis ? Math.round((barPositions[i][j] + categoryWidth / 2) * 1000) / 1000 : 0;
                const y = isXAxis ? height - paddingY - rectHeight : Math.round((barPositions[i][j] + paddingY + categoryWidth / 2) * 1000) / 1000;

                return (
                  <rect
                    key={`bar-${i}-${j}`}
                    data-value={data.data[j]}
                    x={x}
                    y={y}
                    width={rectWidth}
                    height={rectHeight}
                    fill={data.color}
                  >
                    <animate attributeName="height" from={0} to={rectHeight} dur="10s" fill="freeze" />
                    {/* <animate attributeName="y" from={height - paddingY} to={y} dur="10s" /> */}
                  </rect>
                );
              })}
            </g>
          ))}
        </React.Fragment>
      ));
  }

  const generateLabels = (isXAxis: boolean = true) => {
    const axisData = isXAxis ? xAxisData : yAxisData;
    return axisData?.filter(xy => xy.label).map((axis) => {

      const barHeight = ((3 - min) / (max - min)) * (height - 2 * paddingY)
      const maxY = height -
        paddingY -
        (((max - min) - min) / (max - min)) * (height - 2 * paddingY);

      return (
        <text
          key={`${isXAxis ? 'x' : 'y'}-axis-label-${axis.label} `}
          x={isXAxis ? ((width - 2 * paddingX) / 2 + paddingX) : (maxY - barHeight / 2)}
          y={isXAxis ? 40 : -30}
          dominantBaseline="auto"
          textAnchor="middle"
          className={"text-sm fill-white font-normal stroke-none origin-center" + (isXAxis ? ' ' : '  transform -rotate-90')}
        >
          {axis.label}
        </text>
      )
    })
  }


  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <title></title>
      <desc></desc>

      {/* Bars */}
      <g
        clipPath="url(#:r30:-clip-path)"
        style={{ shapeRendering: 'crispEdges', transition: 'opacity 0.2s ease-in 0s, fill 0.2s ease-in 0s' }}
        transform={`translate(${paddingX}, 0)`}
      // onMouseMove={(e) => {
      //   const target = e.target as HTMLDivElement;
      //   const value = target.getAttribute('data-value');

      //   // if (!value) return
      //   const x = e.clientX;
      //   const y = e.clientY;

      //   // console.log(value, x, y)
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
        <rect x="0" y={paddingY} width={width - 2 * paddingX} height={height - 2 * paddingY} fill="transparent" />
        {generateBars(true)}
        {generateBars(false)}
      </g>

      {/* X-Axis Labels */}
      <g
        transform={`translate(0, ${height - paddingY})`}
      >
        <line
          x1={paddingX}
          x2={width - paddingX}
          className="stroke-1 stroke-white"
          style={{ shapeRendering: 'crispEdges' }}
        />

        {xAxisData.filter(x => x?.data.length > 0).length > 0 ? generateLabelsAxisRange(xAxisData, { width, height, paddingX, paddingY, dataset, series }, true) : generateAxisRange({ width, height, paddingX, paddingY, min, max }, true)}

        {/* Axis Labels */}
        {generateLabels(true)}
      </g>

      {/* Y-Axis */}
      <g
        transform={`translate(${paddingX}, 0)`}
      >
        <line
          y1={paddingY}
          y2={height - paddingY}
          className="stroke-1 stroke-white"
          style={{ shapeRendering: 'crispEdges' }}
        />

        {yAxisData.filter(y => y.data.length > 0).length > 0 ? generateLabelsAxisRange(yAxisData, { width, height, paddingX, paddingY, dataset, series }, false) : generateAxisRange({ width, height, paddingX, paddingY, min, max }, false)}

        {/* Axis Labels */}
        {generateLabels(false)}
      </g>

      {/* Labels */}
      {series && (
        <g className="transform translate-y-4 fill-white" transform={`translate(${paddingX}, 0)`}>
          {dataSeries?.map((serie, index) => {
            return (
              <g key={`legend - ${serie?.dataKey || index}`} className="inline-flex items-center space-x-2" transform={`translate(${paddingX + (((width - 2 * paddingX) / series.length) * index)}, 0)`}>
                <rect width="12" height="12" fill={serie.color} />
                <text className="text-base font-normal tracking-wide fill-white transform translate-x-4 align-middle capitalize translate-y-1" dominantBaseline="central">{serie.label}</text>
              </g>
            )
          })}
        </g>
      )}

      <clipPath id=":r30:-clip-path">
        <rect x={0} y={0} width={width} height={height} />
      </clipPath>
    </svg>
  );
};


type LineChartProps = {
  /**
   * X-Axis data.
   * Used to controll the x positions of the data points in series
   */
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
    area?: boolean;
  }[];
  width?: number;
  height?: number;
};
export const LineChart = ({
  xAxis,
  yAxis,
  series = [],
  dataset = [],
  width = 600,
  height = 400,
}: LineChartProps) => {
  const paddingX = 50;
  const paddingY = 50;


  interface Point {
    x: number;
    y: number;
  }

  function catmullRomInterpolation(t: number, p0: number, p1: number, p2: number, p3: number): number {
    const t2 = t * t;
    const t3 = t * t2;
    return 0.5 * (
      (2 * p1) +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3
    );
  }

  function drawCatmullRomChart(
    points: [number, number][],
    numPoints: number = 100
  ) {

    const result = [];
    const numSegments = points.length - 1;

    for (let i = 0; i < numSegments; i++) {
      const p0 = i > 0 ? points[i - 1][1] : points[i][1];
      const p1 = points[i][1];
      const p2 = points[i + 1][1];
      const p3 = i < numSegments - 1 ? points[i + 2][1] : p2;

      for (let j = 0; j < numPoints; j++) {
        const t = j / numPoints;
        const interpolatedValue = catmullRomInterpolation(t, p0, p1, p2, p3);
        result.push({ x: points[i][0] + t * (points[i + 1][0] - points[i][0]), y: interpolatedValue });
      }
    }

    return result;
  }
  const arc = (
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number,
    startAngle: number,
    endAngle: number,
    largeArcFlag: boolean = false,
    sweepFlag: boolean = true
  ): string => {
    // Convert angles from degrees to radians
    startAngle = (startAngle * Math.PI) / 180;
    endAngle = (endAngle * Math.PI) / 180;

    // Calculate the start and end points of the arc
    const startX = centerX + radiusX * Math.cos(startAngle);
    const startY = centerY + radiusY * Math.sin(startAngle);
    const endX = centerX + radiusX * Math.cos(endAngle);
    const endY = centerY + radiusY * Math.sin(endAngle);

    // Use the A command to create the arc path
    const arcCommand = `A ${radiusX} ${radiusY} 0 ${largeArcFlag ? 1 : 0
      } ${sweepFlag ? 1 : 0} ${endX} ${endY}`;

    // Construct the full path command
    const pathData = `M ${startX} ${startY} ${arcCommand}`;

    return pathData;
  }

  // Autogenerate unique hex colors
  const colors = [...Array(series.length)].map((_, i) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
  });

  const dataSeries = series?.map((s, i) => {
    return {
      ...s,
      color: s?.color || colors[i],
      data: (dataset.length > 0 ? dataset?.map((d) => parseInt(d[s.dataKey].toString())) : s.data) ?? [],
    };
  });

  const xAxisData = xAxis?.map((x) => {
    return {
      ...x,
      data: dataset && dataset.length > 0 ? dataset?.map((d) => d[x.dataKey]) : x.data
    };
  }) ?? [{ data: [...Array(series.length)].map((_, i) => i) }];


  const xMax = Math.max(...(xAxis && xAxisData.length > 0 ? xAxisData.flatMap((d) => d?.data.map((d) => parseInt(d.toString()))) : [0, dataSeries[0]?.data?.length - 1]));
  const xMin = Math.min(...(xAxis && xAxisData.length > 0 ? xAxisData.flatMap((d) => d?.data.map((d) => parseInt(d.toString()))) : [0, dataSeries[0]?.data?.length - 1]));

  const yMax = Math.max(...dataSeries.flatMap((d) => d?.data));
  const yMin = Math.min(...dataSeries.flatMap((d) => d?.data));

  // Create a function to map x and y values to the chart's coordinates
  //  const xScale = (x) => (x - xMin) / (xMax - xMin) * (width - paddingX - paddingX);
  //  const yScale = (y) => height - paddingY - (y - yMin) / (yMax - yMin) * (height - paddingY - paddingY);

  const pathData = dataSeries.map((d, i) => {
    return d.data.map((val, index) => {
      const xval = xAxisData.length > 0 && xAxisData ? xAxisData[0]?.data.length > 0 && xAxisData[0].data.length < index ? xAxisData[0]?.data[index] ? parseInt(xAxisData[0]?.data[index]?.toString()) : index : index : index;

      const x = width - numberToChart({ width, height, paddingX, paddingY, dataset, series, min: xMin, max: xMax }, xval, true) - paddingX
      const y = numberToChart({ width, height, paddingX, paddingY, max: Math.max(...d.data), min: Math.min(...d.data) }, val, false)
      return {
        x,
        y
      }
    })
  }); // Path data for the line

  // const path = pathData.map((d, i) => {
  //   let a = d.map((val, index) => {
  //     return `${index == 0 ? 'M' : 'L'} ${val.x} ${val.y}`
  //   }).join(' ') + `${dataSeries[i].area ? ` V${height - paddingY} H0 Z` : ''}`;

  //   return (
  //     <>
  //       <path d={a} stroke={dataSeries[i].color} fill={dataSeries[i].area ? "#ff00033" : 'none'} strokeWidth={2} />
  //       {d.map((val, index) => (<path key={`data-${i}-circle-${index}`} d={arc(val.x, val.y, 5, 5, 0, 359.9, true, true)} stroke={dataSeries[i].color} fill={"#121212"} strokeWidth={3} shapeRendering={"auto"} strokeLinecap="round" />))}
  //     </>
  //   )
  // });

  const path2 = pathData.map((d, i) => {

    const points: [number, number][] = d.map((val, index) => [val.x, val.y]);
    const catmull: { x: number, y: number }[] = drawCatmullRomChart(points);

    let catmullpath = catmull.map((val, index) => {
      return `${index == 0 ? 'M' : 'L'} ${val.x} ${val.y}`
    }
    ).join(' ') + `${dataSeries[i].area ? ` V${height - paddingY} H0 Z` : ''}`;
    return (
      <>
        <path d={catmullpath} stroke={dataSeries[i].color} fill={dataSeries[i].area ? "#ff00033" : 'none'} />
        {d.map((val, index) => (<path key={`data-${i}-circle-${index}`} d={arc(val.x, val.y, 5, 5, 0, 359.9, true, true)} stroke={dataSeries[i].color} fill={"#121212"} strokeWidth={3} shapeRendering={"auto"} strokeLinecap="round" />))}
      </>
    )
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <title></title>
      <desc></desc>

      <g
        transform={`translate(0, ${height - paddingY})`}
      >
        <line
          x1={paddingX}
          x2={width - paddingX}
          className="stroke-1 stroke-white"
          style={{ shapeRendering: 'crispEdges' }}
        />

        {generateAxisRange({ width, height, paddingX, paddingY, min: xMin, max: xMax }, true)}
      </g>

      {/* Y-Axis */}
      <g
        transform={`translate(${paddingX}, 0)`}
      >
        <line
          y1={paddingY}
          y2={height - paddingY}
          className="stroke-1 stroke-white"
          style={{ shapeRendering: 'crispEdges' }}
        />

        {generateAxisRange({ width, height, paddingX, paddingY, min: yMin, max: yMax }, false)}

        {/* Axis Labels */}
        {/* {generateLabels(false)} */}
      </g>


      {/* Paths */}
      <g
        style={{ shapeRendering: 'crispEdges', transition: 'opacity 0.2s ease-in 0s, fill 0.2s ease-in 0s' }}
        transform={`translate(${paddingX}, 0)`}
      >
        <rect x="0" y={paddingY} width={width - 2 * paddingX} height={height - 2 * paddingY} fill="transparent" />

        {/* {path} */}
        {path2}
      </g>

    </svg>
  )
}