
export const Card = ({ data }: any) => {

  return (
    <>
      <div className="pt-10 pb-10 focus:outline-none">
        <div className="bg-white inline-block m-auto relative text-center shadow-xl rounded-xl w-[300px]">
          <div className="relative h-56 mb-8 bg-[url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/barbarian-bg.jpg)] absolute rounded-t-xl">
            <img src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/c/c9/Raptor_PaintRegion3.png" alt="barbarian" />
          </div>
          {sub ?? <div className="uppercase text-xs font-bold mb-1 text-red-900">{sub}</div>}
          <div className="text-2xl text-black font-black mb-1">{title}</div>
          {content ?? <div className="p-5 mb-2">
            {content}
          </div>}

          {tamingFood ?? <div className="text-white font-bold bg-slate-800 rounded-b-xl">
            {tamingFood.map((food, o) => (
              <div key={o}>
                <div className="float-left p-3 w-[33%] bg-inherit rounded-bl-xl">
                  <div className="relative text-2xl mb-2">{food.amount}</div>
                  <div className="uppercase font-normal text-xs">{food.item}</div>
                </div>
                <div className="float-left p-3 w-[33%] bg-inherit">
                  <div className="relative text-2xl mb-2">Time</div>
                  <div className="uppercase font-normal text-xs">{food.time}</div>
                </div>
                <div className="float-left p-3 w-[33%] bg-inherit border-r-0 rounded-br-xl">
                  <div className="relative text-2xl mb-2">150</div>
                  <div className="uppercase font-normal text-xs ">Cost</div>
                </div>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </>
  )
}