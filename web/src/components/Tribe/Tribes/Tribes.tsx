import { navigate, routes } from "@redwoodjs/router";
import { toast } from "@redwoodjs/web/toast";
import { useState } from "react";
import { useAuth } from "src/auth";

import { ContextMenu } from "src/components/Util/ContextMenu/ContextMenu";
import { FormModal } from "src/components/Util/Modal/Modal";
import Table from "src/components/Util/Table/Table";
import { getWeekDates, pluralize, timeTag } from "src/lib/formatters";

import type { FindTribes, permission } from "types/graphql";
import NewTribe from "../NewTribe/NewTribe";
import Tooltip from "src/components/Util/Tooltip/Tooltip";

const TribesList = ({ tribes }: FindTribes) => {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);

  const filterDatesByCurrentWeek = (dates: FindTribes["tribes"]) => {
    let start = +getWeekDates()[0];
    let end = +getWeekDates()[1];
    return dates.filter((d) => {
      let date = +new Date(d.created_at);
      return date >= start && date < end;
    });
  };

  return (
    <div className="relative">
      <FormModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Add new tribe"
      >
        <NewTribe />
      </FormModal>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <button
          className="hover:ring-pea-400 focus:ring-pea-400 dark:ring-pea-600 flex cursor-pointer items-start space-x-4 rounded-lg bg-zinc-200 p-4 shadow-lg ring-1 ring-zinc-500 transition-shadow hover:shadow-sm disabled:cursor-not-allowed disabled:ring-transparent dark:bg-zinc-700"
          onClick={() => setOpen(true)}
          disabled={
            !currentUser ||
            !currentUser?.permissions?.some(
              (p: permission) => p === "tribe_create"
            )
          }
        >
          <div className="dark:border-pea-400 border-pea-100 bg-pea-50 flex !h-12 !w-12 items-center justify-center rounded-full border-2 dark:bg-zinc-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="text-pea-500 fill-pea-500 !h-6 !w-6"
            >
              <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
            </svg>
          </div>
          <div className="text-gray-700 dark:text-white">
            <span className="">Add a new tribe</span>
          </div>
        </button>

        <button
          className="hover:ring-pea-400 focus:ring-pea-400 dark:ring-pea-600 flex items-start space-x-4 rounded-lg bg-zinc-200 p-4 shadow-lg ring-1 ring-zinc-500 transition-shadow hover:shadow-sm dark:bg-zinc-700"
          onClick={() => {
            const randomIndex = Math.floor(Math.random() * tribes.length);
            const randomTribe = tribes[randomIndex];
            toast.success(`You've been assigned to ${randomTribe.name}!`);
          }}
        >
          <div className="dark:border-pea-400 border-pea-100 bg-pea-50 flex !h-12 !w-12 items-center justify-center rounded-full border-2 dark:bg-zinc-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              className="text-pea-500 fill-pea-500 !h-6 !w-6"
            >
              <path d="M213.1 32H106.7C47.84 32 0 79.84 0 138.7V160c0 8.844 7.156 16 16 16S32 168.9 32 160V138.7C32 97.48 65.5 64 106.7 64h106.5C254.4 64 288 97.58 288 138.9c0 27-14.62 52-38.16 65.25L152.5 258.9C137.4 267.4 128 283.4 128 300.7V336c0 8.844 7.156 16.01 16 16.01S160 344.8 160 336V300.7c0-5.766 3.125-11.11 8.156-13.95l97.38-54.78C299.1 213.1 320 177.4 320 138.9C320 79.94 272.1 32 213.1 32zM144 400c-17.67 0-32 14.32-32 31.99s14.33 32 32 32s32-14.33 32-32S161.7 400 144 400z" />
            </svg>
          </div>
          <div className="text-gray-700 dark:text-white">
            <span className="">Pick random tribe name</span>
          </div>
        </button>

        <div className="flex items-start space-x-4 rounded-lg bg-zinc-300 bg-opacity-40 p-4 shadow-lg dark:bg-zinc-700">
          <div className="border-pea-100 bg-pea-50 dark:border-pea-400 flex h-12 w-12 items-center justify-center rounded-full border-2 dark:bg-zinc-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-pea-500 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700 dark:text-white">
              {pluralize(filterDatesByCurrentWeek(tribes).length, "Tribe")}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-stone-200">
              Created this week
            </p>
          </div>
        </div>
      </div>

      <div className="">
        <Table
          className=""
          settings={{
            filter: true,
            select: true,
            search: true,
            pagination: {
              rowsPerPage: 10,
              enabled: true,
              pageSizeOptions: [10, 25, 50, 100],
            },
          }}
          columns={[
            {
              field: "name",
              header: "Name",
              sortable: true,
            },
            {
              field: "created_at",
              header: "Created At",
              sortable: true,
              valueFormatter: ({ value }) => timeTag(value),
            },
            {
              field: "Profile",
              header: "Created By",
              render: ({ value }) => (
                <div className="flex flex-row">
                  {value.avatar_url && (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${value.avatar_url}`}
                      alt={value.full_name || "Profile Image"}
                    />
                  )}
                  <div className="flex items-center pl-3">
                    <div className="text-base">{value.full_name}</div>
                  </div>
                </div>
              ),
            },
            {
              field: "created_at",
              header: "",
              render: ({ row }) => (
                <ContextMenu
                  type="click"
                  items={[
                    {
                      label: "View",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 576 512"
                        >
                          <path d="M160 256C160 185.3 217.3 128 288 128C358.7 128 416 185.3 416 256C416 326.7 358.7 384 288 384C217.3 384 160 326.7 160 256zM288 336C332.2 336 368 300.2 368 256C368 211.8 332.2 176 288 176C287.3 176 286.7 176 285.1 176C287.3 181.1 288 186.5 288 192C288 227.3 259.3 256 224 256C218.5 256 213.1 255.3 208 253.1C208 254.7 208 255.3 208 255.1C208 300.2 243.8 336 288 336L288 336zM95.42 112.6C142.5 68.84 207.2 32 288 32C368.8 32 433.5 68.84 480.6 112.6C527.4 156 558.7 207.1 573.5 243.7C576.8 251.6 576.8 260.4 573.5 268.3C558.7 304 527.4 355.1 480.6 399.4C433.5 443.2 368.8 480 288 480C207.2 480 142.5 443.2 95.42 399.4C48.62 355.1 17.34 304 2.461 268.3C-.8205 260.4-.8205 251.6 2.461 243.7C17.34 207.1 48.62 156 95.42 112.6V112.6zM288 80C222.8 80 169.2 109.6 128.1 147.7C89.6 183.5 63.02 225.1 49.44 256C63.02 286 89.6 328.5 128.1 364.3C169.2 402.4 222.8 432 288 432C353.2 432 406.8 402.4 447.9 364.3C486.4 328.5 512.1 286 526.6 256C512.1 225.1 486.4 183.5 447.9 147.7C406.8 109.6 353.2 80 288 80V80z" />
                        </svg>
                      ),
                      onClick: () => {
                        navigate(routes.tribe({ id: row["id"] }));
                      },
                    },
                    {
                      label: "Edit",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M373.1 24.97C401.2-3.147 446.8-3.147 474.9 24.97L487 37.09C515.1 65.21 515.1 110.8 487 138.9L289.8 336.2C281.1 344.8 270.4 351.1 258.6 354.5L158.6 383.1C150.2 385.5 141.2 383.1 135 376.1C128.9 370.8 126.5 361.8 128.9 353.4L157.5 253.4C160.9 241.6 167.2 230.9 175.8 222.2L373.1 24.97zM440.1 58.91C431.6 49.54 416.4 49.54 407 58.91L377.9 88L424 134.1L453.1 104.1C462.5 95.6 462.5 80.4 453.1 71.03L440.1 58.91zM203.7 266.6L186.9 325.1L245.4 308.3C249.4 307.2 252.9 305.1 255.8 302.2L390.1 168L344 121.9L209.8 256.2C206.9 259.1 204.8 262.6 203.7 266.6zM200 64C213.3 64 224 74.75 224 88C224 101.3 213.3 112 200 112H88C65.91 112 48 129.9 48 152V424C48 446.1 65.91 464 88 464H360C382.1 464 400 446.1 400 424V312C400 298.7 410.7 288 424 288C437.3 288 448 298.7 448 312V424C448 472.6 408.6 512 360 512H88C39.4 512 0 472.6 0 424V152C0 103.4 39.4 64 88 64H200z" />
                        </svg>
                      ),
                      onClick: () => {
                        currentUser?.permissions?.some(
                          (p: permission) => p === "tribe_update"
                        ) && navigate(routes.editTribe({ id: row["id"] }));
                      },
                    },
                  ]}
                >
                  <svg
                    className="w-4 fill-black text-black dark:fill-stone-200 dark:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z" />
                  </svg>
                </ContextMenu>
              ),
            },
          ]}
          rows={tribes}
        />
      </div>
    </div>
  );
};

export default TribesList;
