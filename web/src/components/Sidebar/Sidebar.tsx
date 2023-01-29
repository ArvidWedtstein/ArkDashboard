import { Link, routes, useLocation, useParams } from "@redwoodjs/router";
import { singularize } from "src/lib/formatters";
const Icon = (icon: string) => {
  const icons = {
    home: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current" viewBox="0 0 576 512">
        <path d="M576 247.1c0-6.802-2.877-13.56-8.471-18.31l-263.1-224c-4.484-3.781-10.01-5.669-15.53-5.669S276.1 1.891 272.5 5.672L8.471 229.7C2.877 234.4 0 241.2 0 247.1C0 264.1 13.83 271.1 24.02 271.1c5.479 0 10.99-1.867 15.51-5.687l24.47-20.76v226.5C64 494.1 81.94 512 104 512h95.1c22.06 0 39.1-17.94 39.1-40l.0056-120h95.1l-.0032 120C335.1 494.1 353.9 512 375.1 512h95.1c22.06 0 39.1-17.94 39.1-40V245.5L536.5 266.3c4.516 3.813 10.03 5.688 15.52 5.688C562.1 271.1 576 263.1 576 247.1zM463.1 463.1H383.1v-120c0-22.06-17.94-40-39.1-40H232c-22.06 0-39.1 17.94-39.1 40v120H112V207.1c0-.9629-.4375-1.783-.5488-2.717L288 55.45l175.1 149.4V463.1z" />
      </svg>
    ),
    basespot: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 640 512">
        <path d="M608 160l-32 .0072c-17.67 0-32 14.32-32 31.99v32l-32 .0058V32c0-17.67-14.33-32-32-32h-40c-17.67 0-32 14.33-32 32v32h-32V32c0-17.67-14.33-32-32-32h-48c-17.67 0-32 14.33-32 32v32h-32V32c0-17.67-14.33-32-32-32H160C142.3 0 128 14.33 128 32v192L96 224V192c0-17.67-14.33-31.99-32-31.99L32 160C14.33 160 0 174.3 0 192v256c0 35.35 28.65 64 64 64h512c35.35 0 64-28.65 64-64V192C640 174.3 625.7 160 608 160zM160 32h40v64h96V32h48v64h96V32H480v192H160V32zM384 480H256v-95.99c0-35.29 28.71-64 64-64s64 28.71 64 64V480zM608 448c0 17.64-14.36 32-32 32h-160v-96c0-53.02-42.98-96-96-96s-96 42.98-96 96v96H64c-17.64 0-32-14.36-32-32V192h32v64h512V192h32V448z" />
      </svg>
    ),
    calculator: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 384 512">
        <path d="M192 344c13.26 0 24-10.75 24-24S205.3 296 192 296S168 306.7 168 320S178.7 344 192 344zM192 256c13.26 0 24-10.75 24-24S205.3 208 192 208S168 218.7 168 232S178.7 256 192 256zM280 344c13.26 0 24-10.75 24-24s-10.74-24-24-24S256 306.7 256 320S266.7 344 280 344zM280 256c13.26 0 24-10.75 24-24S293.3 208 280 208S256 218.7 256 232S266.7 256 280 256zM280 432c13.26 0 24-10.75 24-24S293.3 384 280 384S256 394.7 256 408S266.7 432 280 432zM104 432h80c13.26 0 24-10.75 24-24S197.3 384 184 384h-80c-13.26 0-24 10.75-24 24S90.74 432 104 432zM320 0H64C28.65 0 0 28.65 0 64v384c0 35.35 28.65 64 64 64h256c35.35 0 64-28.65 64-64V64C384 28.65 355.3 0 320 0zM336 448c0 8.836-7.164 16-16 16H64c-8.836 0-16-7.164-16-16V176h288V448zM336 128h-288V64c0-8.838 7.164-16 16-16h256c8.836 0 16 7.162 16 16V128zM104 256C117.3 256 128 245.3 128 232S117.3 208 104 208S80 218.7 80 232S90.74 256 104 256zM104 344C117.3 344 128 333.3 128 320S117.3 296 104 296S80 306.7 80 320S90.74 344 104 344z" />
      </svg>
    ),
    guesstheword: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 448 512">
        <path d="M257.1 128h-52C167 128 136 159 136 198c0 13 11 24 24 24s24-11 24-24C184 186 193.1 176 205.1 176h52C269.1 176 280 186 280 198c0 8-4 15-11 19L212 251C204 256 200 264 200 272V288c0 13 11 24 24 24S248 301 248 288V286l45.1-28C315 245 328 222 328 198C328 159 297 128 257.1 128zM224 336c-18 0-32 14-32 32s13.1 32 32 32c17.1 0 32-14 32-32S241.1 336 224 336zM384 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V96C448 60.65 419.3 32 384 32zM400 416c0 8.822-7.178 16-16 16H64c-8.822 0-16-7.178-16-16V96c0-8.822 7.178-16 16-16h320c8.822 0 16 7.178 16 16V416z" />
      </svg>
    ),
    tribes: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 640 512">
        <path d="M224 256c70.7 0 128-57.31 128-128S294.7 0 224 0C153.3 0 96 57.31 96 128S153.3 256 224 256zM224 48c44.11 0 80 35.89 80 80c0 44.11-35.89 80-80 80S144 172.1 144 128C144 83.89 179.9 48 224 48zM274.7 304H173.3c-95.73 0-173.3 77.6-173.3 173.3C0 496.5 15.52 512 34.66 512H413.3C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304zM48.71 464C55.38 401.1 108.7 352 173.3 352H274.7c64.61 0 117.1 49.13 124.6 112H48.71zM479.1 320h-73.85C451.2 357.7 480 414.1 480 477.3C480 490.1 476.2 501.9 470 512h138C625.7 512 640 497.6 640 479.1C640 391.6 568.4 320 479.1 320zM432 256C493.9 256 544 205.9 544 144S493.9 32 432 32c-25.11 0-48.04 8.555-66.72 22.51C376.8 76.63 384 101.4 384 128c0 35.52-11.93 68.14-31.59 94.71C372.7 243.2 400.8 256 432 256z" />
      </svg>
    ),
    story: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 640 512">
        <path d="M630.4 236.8l-96-72c-10.62-7.969-25.72-5.797-33.59 4.797c-7.969 10.61-5.812 25.66 4.781 33.61L543.1 232H376V123.3C399.4 113.8 416 90.84 416 64c0-35.34-28.65-64-64-64C316.7 0 288 28.66 288 64c0 26.84 16.56 49.75 40 59.25V232h-176V123.3C175.4 113.8 192 90.84 192 64c0-35.34-28.65-64-64-64C92.65 0 64 28.66 64 64c0 26.84 16.56 49.75 40 59.25V232h-80C10.75 232 0 242.8 0 256s10.75 24 24 24h176v108.7C176.6 398.3 160 421.2 160 448c0 35.34 28.65 64 64 64c35.35 0 64-28.66 64-64c0-26.84-16.56-49.75-40-59.25V280h295.1l-38.4 28.8c-10.59 7.953-12.75 23-4.781 33.61C505.5 348.7 512.7 352 520 352c5 0 10.06-1.562 14.38-4.797l96-72C636.4 270.7 640 263.5 640 256S636.4 241.3 630.4 236.8zM352 40c13.23 0 24 10.77 24 24c0 13.23-10.77 24-24 24c-13.23 0-24-10.77-24-24C328 50.77 338.8 40 352 40zM128 40c13.23 0 24 10.77 24 24c0 13.23-10.77 24-24 24C114.8 88 104 77.23 104 64C104 50.77 114.8 40 128 40zM224 472c-13.23 0-24-10.77-24-24c0-13.23 10.77-24 24-24c13.23 0 24 10.77 24 24C248 461.2 237.2 472 224 472z" />
      </svg>
    ),
  }
  return icons[icon.toLowerCase()] || null
}
const Sidebar = () => {
  const { pathname } = useLocation()
  const navigation = [
    { name: 'Home', href: routes.home(), color: 'bg-pea-500' },
    { name: 'Basespot', href: routes.basespots({ page: 1 }), color: 'bg-blue-500' },
    { name: 'Calculator', href: routes.materialCalculator(), color: 'bg-red-500' },
    { name: 'GuessTheWord', href: routes.gtw(), color: 'bg-lime-500' },
    { name: 'Tribes', href: routes.tribes(), color: 'bg-emerald-500' },
    { name: 'Story', href: routes.timelines(), color: 'bg-sky-400' },
  ]


  return (
    <div className="">
      {/* <div className="bg-[#0D2836] text-[#97FBFF] p-3 border border-[#60728F]">
        <div className="sm:py-10 px-10 sm:px-2 py-2 flex sm:flex-col flex-row items-center rounded-2xl justify-between sm:justify-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`${singularize(item.href.split('?')[0]) === singularize(pathname) ? `text-white ${item.color}` : ''} flex-shrink-0 sm:my-4 mx-2 uppercase duration-150 bg-[#11667B] outline outline-1 transition-colors outline-[#11667B] outline-offset-1 hover:outline-offset-0 hover:outline-2 w-10 h-10 dark:text-[#ffffffcc] text-[#dddddd] flex justify-center items-center`}
            >
              {Icon(item.name)}
            </Link>
          ))}
        </div>
      </div> */}
      <div className="sm:py-10 px-10 sm:px-2 py-2 sm:border-r max-sm:border-b flex sm:flex-col flex-row items-center rounded-2xl justify-between sm:justify-center">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`${singularize(item.href.split('?')[0]) === singularize(pathname) ? `text-white ${item.color}` : 'dark:hover:bg-[#c3cff41a] hover:bg-[#c3cff4] bg-[#1f1c2ecc] dark:bg-[#c3cff433] dark:text-[#ffffffcc] text-[#dddddd]'} mx-2 sm:my-4 duration-200 rounded-xl hover:rounded-full flex-shrink-0 w-10 h-10 flex justify-center items-center hover:text-white outline-none`}
          >
            {Icon(item.name)}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
