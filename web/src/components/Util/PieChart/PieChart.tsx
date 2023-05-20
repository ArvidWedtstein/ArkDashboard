import { useEffect, useRef } from "react"
import { BgColor } from "src/lib/formatters"

type ItemProps = {
  color: string | undefined;
  percent: number;

}
type PieChartProps = React.HTMLAttributes<HTMLDivElement> & {
  // size?: number
  hollowPercentage?: number
  items?: ItemProps[]
  backgroundColor?: string
  // text?: string
}
export const PieChart = ({ items, backgroundColor, hollowPercentage = 0, ...props }: PieChartProps) => {
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

    if (!items) return
    setTimeout(() => {
      let pies = document.querySelectorAll('circle:not(#piebg)')
      let lastlength = 0

      if (!pies) return
      pies.forEach((pie: any, i) => {
        let totallength = pie.getTotalLength();
        let strokedash = ((Math.abs(items[i].percent) * totallength) / 100);
        pies[i].setAttribute('stroke-dasharray', `${strokedash} ${totallength}`);
        pies[i].setAttribute('stroke-dashoffset', `-${lastlength}`);
        pies[i].setAttribute('stroke', items[i].color);
        lastlength = strokedash + lastlength;
      });
    }, 100)
  }, [items, hollowPercentage])
  let fill = 10
  return (
    <div {...props}>
      <svg className="block bg-transparent rounded-full max-w-sm" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> {/* width={size} height={size} */}
        {backgroundColor && <circle id="piebg" className="transition-all ease-out duration-1000 fill-transparent" cx="10" cy="10" r={((hollowPercentage / 100) * (20 - (fill / 2)))} strokeWidth={fill} stroke={backgroundColor} transform="rotate(-90) translate(-20)" />}
        {items && (
          items.sort((a, b) => b.percent - a.percent).map((item, index) => (
            <circle key={index} id={`pie${index}`} className="transition-all ease-out duration-1000 fill-transparent" cx="10" cy="10" r={((hollowPercentage / 100) * (20 - (fill / 2)))} strokeLinecap="butt" strokeWidth={fill} transform="rotate(-90) translate(-20)" />
          ))
        )}
        {/* {text && (
          <text className="text-center" x="50%" y="50%" dominantBaseline="middle" fontSize="4" textAnchor="middle">
            {text}
          </text>
        )} */}
        {props.children}
      </svg>
      {/* <div className="w-fit p-2 text-white">
        <div className="h-60 rounded-lg sm:h-80">
          <div className="flex h-full flex-col p-4">
            <div className="">
              <div className="flex items-center">
                <div className="flex-grow"></div>
                <div className="ml-2">Last {grid.length} Months</div>
              </div>
              {grid.length > 0 && (
                <div className="ml-5 font-bold capitalize">
                  {grid[0].label} - {grid[grid.length - 1].label}
                </div>
              )}
            </div>
            <div className="flex-grow">
              <div className="recharts-responsive-container h-full w-full">
                <div className="recharts-wrapper relative h-[300px] w-[700px]">
                  <svg
                    className="recharts-surface"
                    width="700"
                    height="300"
                    viewBox="0 0 700 300"
                    version="1.1"
                  >
                    <defs>
                      <linearGradient
                        id="paint0_linear"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop stopColor="#6B8DE3"></stop>
                        <stop offset="1" stopColor="#7D1C8D"></stop>
                      </linearGradient>
                      <linearGradient
                        id="line_linear_gradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop stopColor="#5bcd85"></stop>
                        <stop offset="1" stopColor="#34b364"></stop>
                      </linearGradient>
                    </defs>
                    <g className="recharts-cartesian-grid">
                      <g className="recharts-cartesian-grid-vertical">
                        {grid.map((_, index) => (
                          <line
                            key={`gridline - ${ index }`}
                            strokeWidth="6"
                            stroke="#252525"
                            fill="none"
                            x={65 + 71.125 * index}
                            y="5"
                            width="569"
                            height="200"
                            x1={65 + 71.125 * index}
                            y1="5"
                            x2={65 + 71.125 * index}
                            y2="220"
                          />
                        ))}
                      </g>
                    </g>
                    <g className="recharts-layer recharts-cartesian-axis recharts-xAxis xAxis">
                      <g className="recharts-cartesian-axis-ticks">
                        {grid.map((month, index) => (
                          <g
                            className="recharts-layer recharts-cartesian-axis-tick"
                            key={`month - ${ index }`}
                          >
                            <text
                              width="569"
                              height="30"
                              x={65 + 71.125 * index}
                              y="230"
                              stroke="none"
                              fill="#666"
                              className="recharts-text recharts-cartesian-axis-tick-value capitalize"
                              textAnchor="middle"
                            >
                              <tspan x={65 + 71.125 * index} dy="0.71em">
                                {month.label}
                              </tspan>
                            </text>
                          </g>
                        ))}
                      </g>
                    </g>
                    <g className="recharts-layer recharts-cartesian-axis recharts-yAxis yAxis">
                      <g className="recharts-cartesian-axis-ticks">
                        {[0, 650, 1300, 1950, 2600].map((tick, index) => (
                          <g
                            className="recharts-layer recharts-cartesian-axis-tick"
                            key={`value - ${ index }`}
                          >
                            <text
                              width="60"
                              height="200"
                              x="49"
                              y={220 - tick / 13}
                              stroke="none"
                              fill="#666"
                              className="recharts-text recharts-cartesian-axis-tick-value"
                              textAnchor="end"
                            >
                              <tspan x="49" dy="0.355em">
                                {tick}
                              </tspan>
                            </text>
                          </g>
                        ))}
                      </g>
                    </g>
                    <g className="recharts-layer recharts-line">
                      <path
                        stroke="#dddddd"
                        strokeWidth="3"
                        strokeDasharray="8 8"
                        fill="none"
                        width="600"
                        height="300"
                        className="recharts-curve recharts-line-curve z-0"
                        d={path}
                      />
                    </g>
                    <g className="recharts-layer recharts-line">
                      <path
                        // stroke="none"
                        stroke="url(#line_linear_gradient)"
                        strokeWidth="4"
                        fill="none"
                        width="600"
                        height="300"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="recharts-curve recharts-line-curve"
                        d={path}
                      //   d="M65,48.787215407603554
                      // C88.70833333333333,52.08354278566151,
                      // 112.41666666666667,55.37987016371946,
                      // 136.125,155.37987016371946
                      // C159.83333333333334,55.37987016371946,
                      // 183.54166666666666,55.31375355528897,
                      // 207.25,15.31375355528897
                      // C230.95833333333334,55.31375355528897,
                      // 254.66666666666666,63.1456317307987,
                      // 278.375,78.80938808181816
                      // C302.0833333333333,94.47314443283761,
                      // 325.7916666666667,159.37017169008817,
                      // 349.5,159.37017169008817
                      // C373.2083333333333,159.37017169008817,
                      // 396.9166666666667,99.76602814025466,
                      // 420.625,99.76602814025466
                      // C444.3333333333333,99.76602814025466,
                      // 468.0416666666667,129.98249279188164,
                      // 491.75,129.98249279188164
                      // C515.4583333333334,129.98249279188164,
                      // 539.1666666666666,23.2724149434207,
                      // 562.875,23.2724149434207
                      // C586.5833333333334,23.2724149434207,
                      // 610.2916666666666,53.6005700527309,
                      // 634,183.9287251620411"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="rw-segment relative">
        <section className="rw-segment h-[40rem]">
          <div
            ref={imgTrack}
            style={{ transform: "translate(0%, -50%)" }}
            className="absolute left-1/2 top-1/2 flex h-full min-w-[100vw] cursor-grab touch-pan-x select-none flex-row items-stretch space-x-3 overflow-x-auto p-3 will-change-scroll"
            id="image-track"
            data-mouse-down-at="0"
            data-prev-percentage="0"
            onMouseDown={handleOnDown}
            onMouseUp={handleOnUp}
            onMouseMove={handleOnMove}
            onMouseLeave={handleOnUp}
            onTouchStart={(e) => handleOnDown(e.touches[0])}
            onTouchEnd={handleOnUp}
            onTouchMove={(e) => handleOnMove(e.touches[0])}
            onTouchCancel={handleOnUp}
            onScroll={handleScroll}
          >
            {timelineBasespots.length > 0 &&
              timelineBasespots.map((timelineBasespot, i) => (
                <div
                  key={i}
                  aria-controls={`tab - ${ i }`}
                  className="image relative flex min-w-[50vmin] flex-1 flex-col rounded object-cover transition-all duration-300 after:absolute after:left-0 after:top-0 after:block after:h-full after:w-full after:rounded after:bg-gradient-to-b after:from-transparent after:to-black after:content-['']"
                  draggable="false"
                  style={{
                    backgroundImage: `url(${
                        arrRandNoRep(
                          mapImages[timelineBasespot.map]
                    )})`,
                      backgroundSize: "cover",
                      objectPosition: "100% center",
                  }}
                >
                      <div className="z-10 flex h-full flex-col items-start justify-end px-8 py-4 text-stone-200">
                        <p className="text-xl font-bold uppercase">
                          {timelineBasespot.tribe_name}
                        </p>
                        <p className="text-base font-light">
                          {timelineBasespot.Map.name}{" "}
                          {timelineBasespot.basespot_id
                            ? `- ${timelineBasespot.basespot.name}`
                            : ""}
                        </p>
                        <hr className="my-2 h-[1px] w-full rounded border-0 bg-gray-100 dark:bg-stone-200" />
                        <div className="flex w-full flex-row items-center justify-between space-x-6 overflow-y-hidden">
                          <div className="flex flex-col items-start">
                            <p className="text-md font-light">
                              {new Date(
                                timelineBasespot.start_date
                              ).toLocaleDateString("no-NO", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                            <p className="text-xl font-normal">Started</p>
                          </div>
                          <div className="flex flex-col items-start">
                            <p className="text-md font-light">
                              {timelineBasespot.season
                                ? `Season ${timelineBasespot.season}`
                                : "ㅤ"}
                            </p>
                            <p className="text-xl font-normal">
                              {timelineBasespot.server}
                              <img
                                src={
                                  servers[
                                  timelineBasespot.server
                                    .toLowerCase()
                                    .replaceAll(" ", "")
                                  ]
                                }
                                className="ml-1 inline-block h-6 w-6 rounded-full"
                              />
                              {timelineBasespot.cluster && (
                                <span className="ml-2 rounded bg-gray-100 px-2.5 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                  {timelineBasespot.cluster}
                                </span>
                              )}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              navigate(
                                routes.timelineBasespot({
                                  id: timelineBasespot.id.toString(),
                                })
                              )
                            }
                            className="rw-button rw-button-gray-outline !mr-2"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div >
        </section>
      </div> */}
    </div>
  )
}
