import { useState } from "react"

type LookupType = 'user' | 'post' | 'default'
const Lookup = ({ items, type = "default", value = "", children, className }: { items: any[], type?: LookupType, value?: string | number, children?: any, className?: string }) => {
  const [isOpen, setOpen] = useState(false)
  console.log(children)
  const handleOpen = () => {
    setOpen(!isOpen);
  };
  return (
    <div className="relative flex items-center">
      <button id="dropdownButton" onClick={handleOpen} type="button" className={className ? `mr-6 flex items-center text-center ${className}` : "flex items-center text-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"}>
        {children ? children : null}
        <svg className="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen ? (
        <div className="fixed top-16 right-6 z-10 w-60 bg-white rounded shadow dark:bg-gray-700">
          <ul className="overflow-y-auto py-1 max-h-48 text-gray-700 dark:text-gray-200" aria-labelledby="dropdownButton">
            {items.map((item) => {
              return (
                <li>
                  <a href="#" className="flex items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    {"image" in item ?? <img className="mr-2 w-6 h-6 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Jese image" />}
                    {item.name}
                  </a>
                </li>
              )
            })}
          </ul>
          {type === "user" ?? <a href="#" className="flex items-center p-3 text-sm font-medium text-blue-600 bg-gray-50 border-t border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline">
            <svg className="mr-1 w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path></svg>
            Add new user
          </a>}
        </div>
      ) : null}
    </div>
  )
}

export default Lookup

