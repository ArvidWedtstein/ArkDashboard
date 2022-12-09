import { AvailableRoutes, Link } from "@redwoodjs/router"

interface IArkCard {
  title?: String
  subtitle?: String
  content?: String
  ring?: String
  button?: {
    text: String
    link: string
  }
  image?: String
}

const ArkCard = ({ title, subtitle, content, ring, button, image }: IArkCard) => {
  return (
    <div className="relative bg-gray-600 shadow-md rounded-3xl" style={{ background: `${`url('${image}')` ?? "#333333"}`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="bg-[#121317] bg-opacity-60 shadow-md h-full rounded-3xl p-4">
        <div className="flex-none lg:flex">
          <div className=" h-full w-full lg:h-48 lg:w-48   lg:mb-0 mb-3">
            <img src="/favicon.png" alt="sss" className="w-full  object-scale-down lg:object-fit  lg:h-48 rounded-2xl" />
          </div>
          <div className="flex-auto ml-3 justify-evenly py-2">
            <div className="flex flex-wrap ">
              <h2 className="flex-auto text-lg font-medium text-gray-50">{title}</h2>
              <div className="w-full flex-none text-sm text-gray-400 font-bold ">{subtitle}</div>
            </div>
            <p className="mt-3"></p>
            <div className="flex py-4  text-sm text-gray-200">
              <div className="flex-1 inline-flex items-center">
                <p>{content}</p>
              </div>
            </div>
            <div className="flex p-4 pb-2 border-t border-gray-300"></div>
            <div className="flex space-x-2 text-sm font-medium">
              <div className="flex-auto flex space-x-3">
                <button className="mb-2 md:mb-0 bg-gray-600 ring-1 ring-green-500 px-4 py-2 shadow-sm text-gray-100 rounded-full inline-flex items-center space-x-2 ">
                  <div className="flex">
                    <span>{ring}</span>
                    <i className="fa-solid fa-circle text-green-500 animate-pulse my-auto ml-2"></i>
                  </div>
                </button>
              </div>
              <Link to={button.link} className="mb-2 md:mb-0 bg-green-700 font-bold px-5 py-2 shadow-sm text-white rounded-full hover:bg-green-600">
                {button.text}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArkCard
