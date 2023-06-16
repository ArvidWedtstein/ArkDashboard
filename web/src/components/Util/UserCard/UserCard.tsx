import { ContextMenu } from "../ContextMenu/ContextMenu";

type UserCardProps = {
  user: {
    name: string;
    subtext?: string;
    img?: string;
  };
};
const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="group relative flex max-w-fit items-center rounded-lg border border-stone-200 bg-neutral-800 p-4 transition-colors">
      <img
        className="h-16 w-16 shrink-0 rounded-full"
        src={user.img || `https://randomuser.me/portraits/men/4.jpg`}
        alt={user.name}
      />
      <div className="ml-3">
        <p className="text-base font-medium text-slate-300 group-hover:text-white">
          {user.name}
        </p>
        {user.subtext && (
          <p className="text-base font-medium text-slate-500 group-hover:text-slate-300">
            {user.subtext}
          </p>
        )}
      </div>
      <div className="transistion !-m-4 flex translate-x-10 transform flex-col opacity-0 duration-200 group-hover:translate-x-0 group-hover:opacity-100">
        <button className="ml-6 inline-flex items-center border border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-900 transition-colors first:rounded-tr-lg last:rounded-br-lg hover:bg-gray-100 focus:z-10 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-red-500 dark:hover:text-white dark:focus:text-white">
          Account
        </button>
        <button className="ml-6 inline-flex items-center border border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-900 transition-colors first:rounded-tr-lg last:rounded-br-lg hover:bg-gray-100 focus:z-10 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-red-500 dark:hover:text-white dark:focus:text-white">
          Edit
        </button>
        <button className="ml-6 inline-flex items-center border border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-900 transition-colors first:rounded-tr-lg last:rounded-br-lg hover:bg-gray-100 focus:z-10 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-red-500 dark:hover:text-white dark:focus:text-white">
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
