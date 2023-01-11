import { useEffect } from "react"
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
  useEffect(() => {
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
  }, [items, hollowPercentage])
  let fill = 10
  return (
    <div {...props}>
      <svg className="block bg-transparent rounded-full" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> {/* width={size} height={size} */}
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
    </div>
  )
}
