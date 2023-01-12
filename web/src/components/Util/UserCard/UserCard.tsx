import { ContextMenu } from "../ContextMenu/ContextMenu";

const UserCard = ({ }) => {
  return (
    <div className="max-w-fit group flex items-center bg-neutral-800 border border-stone-200 rounded-lg p-4 transition-colors">
      <img className="shrink-0 h-16 w-16 rounded-full" src={`https://randomuser.me/portraits/men/4.jpg`} alt="" />
      <div className="ml-3">
        <p className="text-base font-medium text-slate-300 group-hover:text-white">Ola Nordmann</p>
        <p className="text-base font-medium text-slate-500 group-hover:text-slate-300">Jøde</p>
      </div>
      <div className="!-m-4 transistion duration-500 transform group-hover:opacity-100 group-hover:translate-x-0 translate-x-10 opacity-0 flex flex-col">
        <button className="ml-6 first:rounded-tr-lg last:rounded-br-lg inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 focus:z-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-red-500 transition-colors dark:focus:text-white">Account</button>
        <button className="ml-6 first:rounded-tr-lg last:rounded-br-lg inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 focus:z-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-red-500 transition-colors dark:focus:text-white">Edit</button>
        <button className="ml-6 first:rounded-tr-lg last:rounded-br-lg inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 focus:z-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-red-500 transition-colors dark:focus:text-white">Delete</button>
      </div>
    </div>
  )
};

export default UserCard
