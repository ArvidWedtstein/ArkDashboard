import { useEffect, useRef } from "react";
import { BgColor } from "src/lib/formatters";

type ItemProps = {
  color: string | undefined;
  percent: number;
};
type PieChartProps = React.HTMLAttributes<HTMLDivElement> & {
  // size?: number
  hollowPercentage?: number;
  items?: ItemProps[];
  backgroundColor?: string;
  // text?: string
};
export const PieChart = ({
  items,
  backgroundColor,
  hollowPercentage = 0,
  ...props
}: PieChartProps) => {
  // const [grid, setGrid] = useState([]);
  // useEffect(() => {
  //   if (grid.length < 9) {
  //     for (let i = 0; i < 9; i++) {
  //       const date = new Date(new Date().setDate(1));
  //       date.setMonth(date.getMonth() - i);
  //       const monthName = date.toLocaleString("default", {
  //         month: "short",
  //         year: "numeric",
  //       });

  //       setGrid((prev) => [
  //         ...prev,
  //         {
  //           label: monthName,
  //           date,
  //           value: [650, 2350, 1000, 1350, 600, 1650, 2600, 650, 1950][i],
  //         },
  //       ]);
  //     }
  //     setGrid((prev) => prev.reverse());
  //   }
  // }, []);

  // const generateSmoothLine = useMemo(() => {
  //   return function (coords) {
  //     if (coords.length < 2) {
  //       return "";
  //     }

  //     let path = `M${coords[0].x},${coords[0].y}`;

  //     for (let i = 0; i < coords.length - 1; i++) {
  //       let p0 = i > 0 ? coords[i - 1] : coords[i];
  //       let p1 = coords[i];
  //       let p2 = coords[i + 1];
  //       let p3 = i < coords.length - 2 ? coords[i + 2] : p2;

  //       for (let t = 0; t < 1; t += 0.1) {
  //         let x =
  //           0.5 *
  //           (2 * p1.x +
  //             (-p0.x + p2.x) * t +
  //             (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t * t +
  //             (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t * t * t);
  //         let y =
  //           0.5 *
  //           (2 * p1.y +
  //             (-p0.y + p2.y) * t +
  //             (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t * t +
  //             (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t * t * t);
  //         path += `L${x},${y}`;
  //       }
  //     }

  //     path += `L${coords[coords.length - 1].x},${coords[coords.length - 1].y}`;

  //     return path;
  //   };
  // }, []);

  // const path = useMemo(() => {
  //   if (grid.length === 0) return "";

  //   const xGap = 71.125;
  //   const xOffset = 65;

  //   const points = [];
  //   for (let i = 0; i < grid.length; i++) {
  //     points.push({ x: xOffset + i * xGap, y: 220 - grid[i].value / 13 });
  //   }

  //   return generateSmoothLine(points);
  // }, [grid]);

  useEffect(() => {
    if (!items) return;
    setTimeout(() => {
      let pies = document.querySelectorAll("circle:not(#piebg)");
      let lastlength = 0;

      if (!pies) return;
      pies.forEach((pie: any, i) => {
        let totallength = pie.getTotalLength();
        let strokedash = (Math.abs(items[i].percent) * totallength) / 100;
        pies[i].setAttribute(
          "stroke-dasharray",
          `${strokedash} ${totallength}`
        );
        pies[i].setAttribute("stroke-dashoffset", `-${lastlength}`);
        pies[i].setAttribute("stroke", items[i].color);
        lastlength = strokedash + lastlength;
      });
    }, 100);
  }, [items, hollowPercentage]);
  let fill = 10;
  return (
    <div {...props}>
      <svg
        className="block max-w-sm rounded-full bg-transparent"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        {/* width={size} height={size} */}
        {backgroundColor && (
          <circle
            id="piebg"
            className="fill-transparent transition-all duration-1000 ease-out"
            cx="10"
            cy="10"
            r={(hollowPercentage / 100) * (20 - fill / 2)}
            strokeWidth={fill}
            stroke={backgroundColor}
            transform="rotate(-90) translate(-20)"
          />
        )}
        {items &&
          items
            .sort((a, b) => b.percent - a.percent)
            .map((item, index) => (
              <circle
                key={index}
                id={`pie${index}`}
                className="fill-transparent transition-all duration-1000 ease-out"
                cx="10"
                cy="10"
                r={(hollowPercentage / 100) * (20 - fill / 2)}
                strokeLinecap="butt"
                strokeWidth={fill}
                transform="rotate(-90) translate(-20)"
              />
            ))}
        {/* {text && (
          <text className="text-center" x="50%" y="50%" dominantBaseline="middle" fontSize="4" textAnchor="middle">
            {text}
          </text>
        )} */}
        {props.children}
      </svg>
    </div>
  );
};
