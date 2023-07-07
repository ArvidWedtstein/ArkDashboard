import { useEffect, useRef } from "react";

interface ChartProps {
  labels: string[];
  data: number[];
  width?: number;
  height?: number;
}
const Chart = ({ width = 460, height = 260, labels, data }: ChartProps) => {
  const chartRef = useRef(null)
  useEffect(() => {
    // Create an SVG element to render the chart
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', `${width + 40}`);
    svg.setAttribute('height', `${height + 40}`);
    svg.setAttribute('class', `group`);
    chartRef.current.innerHTML = "";
    chartRef.current.appendChild(svg);

    // Set up the chart dimensions
    const margin = 20; // Margin around the chart
    const xAxisInterval = (width - 2 * margin) / (labels.length - 1); // Interval between x-axis points
    const yAxisMax = Math.max(...data); // Maximum value in the data
    const yAxisMin = Math.min(...data); // Minimum value in the data
    const yAxisRange = yAxisMax - yAxisMin; // Range of the y-axis values

    // Function to map data points to chart coordinates
    function mapPoint(x: number, y: number): [number, number] {
      const xCoord = margin + x * xAxisInterval;
      const yCoord = height - margin - ((y - yAxisMin) / yAxisRange) * (height - 2 * margin);
      return [xCoord, yCoord];
    }

    // Function to calculate the Catmull-Rom interpolation
    function catmullRomInterpolation(p0: number, p1: number, p2: number, p3: number, t: number): number {
      const t2 = t * t;
      const t3 = t * t2;
      return (
        0.5 * ((2 * p1) +
          (-p0 + p2) * t +
          (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
          (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
      );
    }

    // Function to generate the smooth line using Catmull-Rom interpolation
    function generateSmoothLine(points: [number, number][]): string {
      const pathSegments = ['M', points[0][0], points[0][1]];

      for (let i = 1; i < points.length - 2; i++) {
        const p0 = points[i - 1] || points[0];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || points[points.length - 1];

        for (let t = 0; t < 1; t += 0.05) {
          const x = catmullRomInterpolation(p0[0], p1[0], p2[0], p3[0], t);
          const y = catmullRomInterpolation(p0[1], p1[1], p2[1], p3[1], t);
          pathSegments.push('L', x, y);
        }
      }

      pathSegments.push('L', points[points.length - 1][0], points[points.length - 1][1]);

      return pathSegments.join(' ');
    }

    // Function to render the chart
    function renderChart(): void {
      // Clear any existing chart
      svg.innerHTML = '';

      // Create a group for the chart content
      const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      chartGroup.setAttribute('transform', `translate(${margin}, ${margin})`);
      svg.appendChild(chartGroup);

      // Draw x-axis
      const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      xAxis.setAttribute('x1', '0');
      xAxis.setAttribute('y1', `${height}`);
      xAxis.setAttribute('x2', `${width}`);
      xAxis.setAttribute('y2', `${height}`);
      xAxis.setAttribute('stroke', '#dddddd');
      chartGroup.appendChild(xAxis);

      // Draw y-axis
      const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      yAxis.setAttribute('x1', '0');
      yAxis.setAttribute('y1', '0');
      yAxis.setAttribute('x2', '0');
      yAxis.setAttribute('y2', `${height}`);
      yAxis.setAttribute('stroke', '#dddddd');
      chartGroup.appendChild(yAxis);


      // Draw data points and smooth line
      const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      chartGroup.appendChild(labelGroup);

      const points: [number, number][] = [];
      for (let i = 0; i < labels.length; i++) {
        if (i == 0) {
          const [_, y] = mapPoint(0, data[i]);
          points.push([0, y]);
        }
        const [x, y] = mapPoint(i, data[i]);
        points.push([x, y]);

        if (i == labels.length - 1) points.push([width, height]);

        const lineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        lineGroup.setAttribute('transform', `translate(${x}, 0)`);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', `0`);
        label.setAttribute('y', `${height + margin - 5}`);
        label.setAttribute('font-size', '12');
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('fill', 'white');
        label.textContent = labels[i];
        lineGroup.appendChild(label);

        // const yLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        // yLine.setAttribute('x1', `0`);
        // yLine.setAttribute('y1', `${chartHeight}`);
        // yLine.setAttribute('x2', `0`);
        // yLine.setAttribute('y2', `0`);
        // yLine.setAttribute('stroke', '#ffffff');
        // yLine.setAttribute('stroke-opacity', '0.2');
        // lineGroup.appendChild(yLine);

        labelGroup.appendChild(lineGroup);


        const dataPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dataPoint.setAttribute('cx', `${x}`);
        dataPoint.setAttribute('cy', `${y}`);
        dataPoint.setAttribute('r', '3');
        dataPoint.setAttribute('fill', '#12d393'); // bg-accent-500
        dataPoint.setAttribute('stroke', 'none');
        dataPoint.setAttribute('class', ` transition-all duration-300`);
        chartGroup.appendChild(dataPoint);
      }

      const smoothLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      smoothLine.setAttribute('d', generateSmoothLine(points));
      smoothLine.setAttribute('stroke', '#26934f');
      smoothLine.setAttribute('fill', 'none');
      smoothLine.setAttribute('stroke-width', '1');
      smoothLine.setAttribute('stroke-dasharray', `${smoothLine.getTotalLength()} ${smoothLine.getTotalLength()}`);
      smoothLine.setAttribute('stroke-dashoffset', `${smoothLine.getTotalLength()}`);
      smoothLine.setAttribute('class', `transition-all duration-300 animate-circle-progress`);
      chartGroup.appendChild(smoothLine);

      smoothLine.style.animation = `chartLineAnimation 3s ease-out forwards`;

      // Add keyframes for the animation
      const style = document.createElement('style');
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

      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', 'chartGradient');
      gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
      gradient.setAttribute('x1', '0');
      gradient.setAttribute('y1', `0`);
      gradient.setAttribute('x2', '0');
      gradient.setAttribute('y2', `${height}`);
      chartGroup.appendChild(gradient);


      // Add gradient stops
      const gradientStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      gradientStop1.setAttribute('offset', '0');
      gradientStop1.setAttribute('stop-color', '#34b364');
      gradientStop1.setAttribute('stop-opacity', '0.2');
      gradient.appendChild(gradientStop1);

      const gradientStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      gradientStop2.setAttribute('offset', '1');
      gradientStop2.setAttribute('stop-color', '#34b364');
      gradientStop2.setAttribute('stop-opacity', '0.2');
      gradient.appendChild(gradientStop2);

      // Create filled area
      const filledArea = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const areaPath = `${smoothLine.getAttribute('d')} V${height} H0 Z`;
      filledArea.setAttribute('d', areaPath);
      filledArea.setAttribute('fill', 'url(#chartGradient)');
      filledArea.setAttribute('fill-opacity', '1');
      chartGroup.appendChild(filledArea);
    }

    // Call the renderChart function to generate the chart
    renderChart();
  }, [])
  return (
    <div ref={chartRef}></div>
  )
}

export default Chart
