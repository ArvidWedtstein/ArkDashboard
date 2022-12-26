import { useState } from "react";

const Timeline = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const onChange = (e) => {
    // console.log(e.target.parentElement.dataset.tab);
    setCurrentTab(e.currentTarget.getAttribute("data-tab"));
    document.querySelectorAll("div[data-tab-id]").forEach((tab: any, i) => {
      if (
        tab.getAttribute("data-tab-id") ===
        e.currentTarget.getAttribute("data-tab")
      ) {
        tab.style.display = "block";
      } else {
        tab.style.display = "none";
      }
    });
  };
  return (
    <section>
      <div className="w-100 h-100">
        <div className="events-wrapper bg-slate-600">
          <div className="events">
            <ol className="flex flex-row items-center justify-start space-x-3 overflow-x-auto p-3">
              <li
                className="rounded-md bg-slate-200 text-black dark:bg-neutral-800 dark:text-white"
                data-tab="0"
                onClick={onChange}
                aria-controls="tabs-0"
              >
                <div className="flex h-16 w-full rounded-t-md bg-[url(https://mosscm.com/wp-content/uploads/2017/11/news-dallas-skyline.jpg)] bg-cover bg-center"></div>
                <div className="flex min-h-[100px] flex-col items-start py-3 px-6">
                  <p className="text-xs">The Island</p>
                  <p className="font-bold uppercase">Sussymen</p>
                  <hr className="bg-gray-150 mb-2 h-[1px] w-full rounded border-0 dark:bg-stone-200"></hr>
                  <div className="flex flex-row space-y-2">
                    <div className="flex flex-row items-center space-x-6">
                      <div className="flex flex-col items-start">
                        <p className="text-xs font-light">16 Jan</p>
                        <p className="text-sm font-normal">Played</p>
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="text-xs font-light">Season 1</p>
                        <p className="text-sm font-normal">Bloody Ark</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li
                className="rounded-md bg-slate-200 text-black dark:bg-neutral-800 dark:text-white"
                data-tab="1"
                onClick={onChange}
              >
                <div className="flex h-16 w-full rounded-t-md bg-[url(https://mosscm.com/wp-content/uploads/2017/11/news-dallas-skyline.jpg)] bg-cover bg-center"></div>
                <div className="flex min-h-[100px] flex-col items-start py-3 px-6">
                  <p className="text-xs">The Island</p>
                  <p className="font-bold uppercase">Sussymen</p>
                  <hr className="bg-gray-150 mb-2 h-[1px] w-full rounded border-0 dark:bg-stone-200"></hr>
                  <div className="flex flex-row space-y-2">
                    <div className="flex flex-row items-center space-x-6">
                      <div className="flex flex-col items-start">
                        <p className="text-xs font-light">16 Jan</p>
                        <p className="text-sm font-normal">Played</p>
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="text-xs font-light">Season 1</p>
                        <p className="text-sm font-normal">Bloody Ark</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li
                className="rounded-md bg-slate-200 text-black dark:bg-neutral-800 dark:text-white"
                data-tab="2"
                onClick={onChange}
              >
                <div className="flex h-16 w-full rounded-t-md bg-[url(https://mosscm.com/wp-content/uploads/2017/11/news-dallas-skyline.jpg)] bg-cover bg-center"></div>
                <div className="flex min-h-[100px] flex-col items-start py-3 px-6">
                  <p className="text-xs">The Island</p>
                  <p className="font-bold uppercase">Sussymen</p>
                  <hr className="bg-gray-150 mb-2 h-[1px] w-full rounded border-0 dark:bg-stone-200"></hr>
                  <div className="flex flex-row space-y-2">
                    <div className="flex flex-row items-center space-x-6">
                      <div className="flex flex-col items-start">
                        <p className="text-xs font-light">16 Jan</p>
                        <p className="text-sm font-normal">Played</p>
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="text-xs font-light">Season 1</p>
                        <p className="text-sm font-normal">Bloody Ark</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>
        <div className="w-full bg-gray-600 p-1">
          <div
            className="m-2 hidden rounded-md bg-slate-200 text-black dark:bg-neutral-800 dark:text-white"
            data-tab-id="0"
          >
            test<br></br>test test test1
          </div>
          <div
            className="m-2 hidden rounded-md bg-slate-200 text-black dark:bg-neutral-800 dark:text-white"
            data-tab-id="1"
          >
            test<br></br>test test test2
          </div>
          <div
            className="m-2 hidden rounded-md bg-slate-200 text-black dark:bg-neutral-800 dark:text-white"
            data-tab-id="2"
          >
            test<br></br>test test test3
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
