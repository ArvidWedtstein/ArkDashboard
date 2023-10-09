import { ReactNode, useEffect, useRef } from "react";
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

    const line = (x1: number, y1: number, x2: number, y2: number, stroke: string = '#dddddd') => {
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
    }
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
            labelY.setAttribute("text-anchor", "right");
            labelY.setAttribute("alignment-baseline", "middle");
            labelY.setAttribute("fill", "white");
            labelY.textContent = i.toFixed(1).toString();
            lineGroupY.appendChild(labelY);
          }

          if (options?.horizontalLines) {
            const yLine = line(0, height -
              margin -
              ((i - yAxisMin) / yAxisRange) * (height - 2 * margin), width, height -
              margin -
            ((i - yAxisMin) / yAxisRange) * (height - 2 * margin))
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
    scaleType?: "linear" | "log" | "time" | "band" | "point" | "ordinal";
    id?: string;
    valueFormatter?: (value: string | number) => string;
  }[];
  yAxis?: {
    id: string;
    data: string[] | number[];
    scaleType?: "linear" | "log" | "time" | "band" | "point" | "ordinal";
    valueFormatter?: (value: string | number) => string;
  }[];
  series?: {
    id: string;
    name: string;
    data: number[];
    type: "line" | "bar" | "pie";
    yAxisId?: string; // One of yAxis ids
    color?: string;
  }[];
  width?: number;
  height?: number;
}

export const ChartContainer = ({ xAxis, yAxis, series }: ChartContainerProps) => {

  const genAxis = () => {

  }

  return (
    <svg width="600" height="400" viewBox="0 0 600 400" className="stroke-white">
      <title>test</title>
      <desc></desc>
      <g clipPath="url(#:r1eb:-clip-path)">
        <g></g>
        <g>
          <path d="M50,318.71C55.948,318.293,61.897,317.875,67.845,317.057C73.793,316.239,79.742,313.802,85.69,313.802C91.654,313.802,97.619,316.638,103.584,316.638C109.532,316.638,115.48,312.725,121.429,310.92C127.377,309.116,133.325,307.192,139.273,305.811C145.222,304.43,151.17,304.168,157.118,302.634C163.083,301.095,169.048,299.231,175.012,296.582C180.961,293.94,186.909,290.007,192.857,286.769C198.805,283.531,204.754,280.632,210.702,277.154C216.65,273.676,222.599,268.628,228.547,265.903C234.512,263.171,240.476,262.038,246.441,260.799C252.389,259.563,258.337,259.092,264.286,258.472C270.234,257.852,276.182,258.008,282.131,257.08C288.079,256.151,294.027,251.067,299.976,249.062C305.94,247.051,311.905,246.836,317.869,245.045C323.818,243.259,329.766,240.589,335.714,238.338C341.663,236.088,347.611,231.543,353.559,231.543C359.508,231.543,365.456,231.823,371.404,232.382C377.369,232.943,383.333,244.651,389.298,244.651C395.246,244.651,401.195,241.06,407.143,239.133C413.091,237.206,419.039,233.09,424.988,233.09C430.936,233.09,436.884,234.29,442.833,234.29C448.797,234.29,454.762,233.68,460.727,233.68C466.675,233.68,472.623,234.73,478.571,234.73C484.52,234.73,490.468,232.725,496.416,231.73C502.365,230.735,508.313,230.535,514.261,228.76C520.226,226.98,526.19,223.372,532.155,221.05C538.103,218.734,544.052,216.787,550,214.841" className="MuiLineElement-root MuiLineElement-series-auto-generated-id-0 css-1b3bmv"></path>
          <path d="M50,346.09C55.948,340.857,61.897,335.624,67.845,332.3C73.793,328.977,79.742,326.149,85.69,326.149C91.654,326.149,97.619,327.493,103.584,327.493C109.532,327.493,115.48,321.297,121.429,318.599C127.377,315.902,133.325,313.327,139.273,311.311C145.222,309.294,151.17,308.692,157.118,306.5C163.083,304.302,169.048,301.101,175.012,298.131C180.961,295.168,186.909,291.872,192.857,288.704C198.805,285.536,204.754,282.853,210.702,279.124C216.65,275.394,222.599,269.945,228.547,266.327C234.512,262.699,240.476,259.437,246.441,257.397C252.389,255.363,258.337,254.851,264.286,254.091C270.234,253.33,276.182,253.672,282.131,252.836C288.079,251.999,294.027,247.192,299.976,244.713C305.94,242.227,311.905,242.097,317.869,237.944C323.818,233.802,329.766,225.77,335.714,219.859C341.663,213.948,347.611,206.98,353.559,202.478C359.508,197.976,365.456,192.846,371.404,192.846C377.369,192.846,383.333,210.371,389.298,210.371C395.246,210.371,401.195,195.948,407.143,188.904C413.091,181.861,419.039,168.983,424.988,168.11C430.936,167.237,436.884,167.173,442.833,166.8C448.797,166.426,454.762,166.49,460.727,165.87C466.675,165.252,472.623,162.247,478.571,160.78C484.52,159.313,490.468,158.348,496.416,157.07C502.365,155.792,508.313,155.316,514.261,153.11C520.226,150.898,526.19,146.285,532.155,143.802C538.103,141.326,544.052,139.775,550,138.224" className="MuiLineElement-root MuiLineElement-series-auto-generated-id-1 css-m2g13d"></path>
          <path d="M50,338.11C55.948,340.089,61.897,342.068,67.845,342.08C73.793,342.092,79.742,342.098,85.69,342.098C91.654,342.098,97.619,338.991,103.584,336.507C109.532,334.029,115.48,329.744,121.429,327.225C127.377,324.705,133.325,323.379,139.273,321.388C145.222,319.397,151.17,317.604,157.118,315.278C163.083,312.944,169.048,310.081,175.012,307.402C180.961,304.731,186.909,302.014,192.857,299.226C198.805,296.438,204.754,293.789,210.702,290.675C216.65,287.56,222.599,283.417,228.547,280.54C234.512,277.654,240.476,275.607,246.441,273.396C252.389,271.19,258.337,269.907,264.286,267.287C270.234,264.667,276.182,260.333,282.131,257.676C288.079,255.018,294.027,253.657,299.976,251.342C305.94,249.021,311.905,246.013,317.869,243.764C323.818,241.52,329.766,239.848,335.714,237.859C341.663,235.871,347.611,231.833,353.559,231.833C359.508,231.833,365.456,233.673,371.404,237.352C377.369,241.041,383.333,255.976,389.298,255.976C395.246,255.976,401.195,253.403,407.143,252.455C413.091,251.508,419.039,251.008,424.988,250.29C430.936,249.572,436.884,249.226,442.833,248.15C448.797,247.071,454.762,245.91,460.727,243.82C466.675,241.736,472.623,237.845,478.571,235.64C484.52,233.435,490.468,232.087,496.416,230.59C502.365,229.093,508.313,228.061,514.261,226.66C520.226,225.255,526.19,223.379,532.155,222.172C538.103,220.967,544.052,220.193,550,219.419" className="MuiLineElement-root MuiLineElement-series-auto-generated-id-2 css-7mtcwn"></path>
        </g>
      </g>
      <g transform="translate(0, 350)" className="MuiChartsAxis-root MuiChartsAxis-directionX MuiChartsAxis-bottom css-1da9t35">
        <line x1="50" x2="550" className="MuiChartsAxis-line css-sj8i6k"></line>
        <g transform="translate(50, 0)" className="MuiChartsAxis-tickContainer">
          <line y2="6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="0" y="9" transform-origin="0px 9px" className="MuiChartsAxis-tickLabel text-white">1990</text>
        </g>
        <g transform="translate(85.68984061797204, 0)" className="MuiChartsAxis-tickContainer">
          <line y2="6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="0" y="9" transform-origin="0px 9px" className="MuiChartsAxis-tickLabel text-white">1992</text>
        </g>
        <g transform="translate(121.42857142857143, 0)" className="MuiChartsAxis-tickContainer">
          <line y2="6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="0" y="9" transform-origin="0px 9px" className="MuiChartsAxis-tickLabel text-white">1994</text>
        </g>
        <g transform="translate(157.11841204654345, 0)" className="MuiChartsAxis-tickContainer">
          <line y2="6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="0" y="9" transform-origin="0px 9px" className="MuiChartsAxis-tickLabel text-white">1996</text>
        </g>
        <g transform="translate(192.85714285714286, 0)" className="MuiChartsAxis-tickContainer">
          <line y2="6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="0" y="9" transform-origin="0px 9px" className="MuiChartsAxis-tickLabel text-white">1998</text>
        </g>
        <g transform="translate(228.5469834751149, 0)" className="MuiChartsAxis-tickContainer">
          <line y2="6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="0" y="9" transform-origin="0px 9px" className="MuiChartsAxis-tickLabel text-white">2000</text>
        </g>
        <g transform="translate(264.2857142857143, 0)" className="MuiChartsAxis-tickContainer">
          <line y2="6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="0" y="9" transform-origin="0px 9px" className="MuiChartsAxis-tickLabel text-white">2002</text>
        </g>
        <g transform="translate(299.97555490368626, 0)" className="MuiChartsAxis-tickContainer">
          <line y2="6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="0" y="9" transform-origin="0px 9px" className="MuiChartsAxis-tickLabel text-white">2004</text>
        </g>
        <g transform="translate(335.7142857142857, 0)" className="MuiChartsAxis-tickContainer">
          <line y2="6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="0" y="9" transform-origin="0px 9px" className="MuiChartsAxis-tickLabel text-white">2006</text>
        </g>
        <g transform="translate(371.40412633225776, 0)" className="MuiChartsAxis-tickContainer">
          <line y2="6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="0" y="9" transform-origin="0px 9px" className="MuiChartsAxis-tickLabel text-white">2008</text>
        </g>
        <g transform="translate(407.14285714285717, 0)" className="MuiChartsAxis-tickContainer">
          <line y2="6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="0" y="9" transform-origin="0px 9px" className="MuiChartsAxis-tickLabel text-white">2010</text>
        </g>
        <g transform="translate(442.83269776082915, 0)" className="MuiChartsAxis-tickContainer">
          <line y2="6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="0" y="9" transform-origin="0px 9px" className="MuiChartsAxis-tickLabel text-white">2012</text>
        </g>
        <g transform="translate(478.57142857142856, 0)" className="MuiChartsAxis-tickContainer">
          <line y2="6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="0" y="9" transform-origin="0px 9px" className="MuiChartsAxis-tickLabel text-white">2014</text>
        </g>
        <g transform="translate(514.2612691894005, 0)" className="MuiChartsAxis-tickContainer">
          <line y2="6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="0" y="9" transform-origin="0px 9px" className="MuiChartsAxis-tickLabel text-white">2016</text>
        </g>
        <g transform="translate(550, 0)" className="MuiChartsAxis-tickContainer">
          <line y2="6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="0" y="9" transform-origin="0px 9px" className="MuiChartsAxis-tickLabel text-white">2018</text>
        </g>
      </g>
      <g transform="translate(50, 0)" className="MuiChartsAxis-root MuiChartsAxis-directionY MuiChartsAxis-left css-1da9t35">
        <line y1="350" y2="100" className="MuiChartsAxis-line css-sj8i6k"></line>
        <g transform="translate(0, 350)" className="MuiChartsAxis-tickContainer">
          <line x2="-6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="-8" y="0" transform-origin="-8px 0px" className="MuiChartsAxis-tickLabel text-white">25,000</text>
        </g>
        <g transform="translate(0, 300)" className="MuiChartsAxis-tickContainer">
          <line x2="-6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="-8" y="0" transform-origin="-8px 0px" className="MuiChartsAxis-tickLabel text-white">30,000</text>
        </g>
        <g transform="translate(0, 250)" className="MuiChartsAxis-tickContainer">
          <line x2="-6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="-8" y="0" transform-origin="-8px 0px" className="MuiChartsAxis-tickLabel text-white">35,000</text>
        </g>
        <g transform="translate(0, 200)" className="MuiChartsAxis-tickContainer">
          <line x2="-6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="-8" y="0" transform-origin="-8px 0px" className="MuiChartsAxis-tickLabel text-white">40,000</text>
        </g>
        <g transform="translate(0, 150)" className="MuiChartsAxis-tickContainer">
          <line x2="-6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="-8" y="0" transform-origin="-8px 0px" className="MuiChartsAxis-tickLabel text-white">45,000</text>
        </g>
        <g transform="translate(0, 100)" className="MuiChartsAxis-tickContainer">
          <line x2="-6" className="MuiChartsAxis-tick css-1akpp5l"></line>
          <text x="-8" y="0" transform-origin="-8px 0px" className="MuiChartsAxis-tickLabel text-white">50,000</text>
        </g>
      </g>
      <g></g>
      <g className="MuiChartsLegend-root MuiChartsLegend-row css-u9urbm">
        <g className="MuiChartsLegend-series css-g7dree">
          <rect className="MuiChartsLegend-mark css-dotzn4"></rect>
          <text className="MuiChartsLegend-label css-12yoiof">French GDP per capita</text>
        </g>
        <g className="MuiChartsLegend-series css-1ul774o">
          <rect className="MuiChartsLegend-mark css-booo1k"></rect>
          <text className="MuiChartsLegend-label css-12yoiof">German GDP per capita</text>
        </g>
        <g className="MuiChartsLegend-series css-16aubni">
          <rect className="MuiChartsLegend-mark css-1nwlj7h"></rect>
          <text className="MuiChartsLegend-label css-12yoiof">UK GDP per capita</text>
        </g>
      </g>
      <clipPath id=":r1eb:-clip-path">
        <rect x="50" y="100" width="500" height="250"></rect>
      </clipPath>
    </svg>
  )
}
