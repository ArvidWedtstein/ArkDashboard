const Timeline = () => {
  return (
    <section>
      <div className="w-100 h-100 bg-gray-400">
        <div className="events-wrapper">
          <div className="events">
            <ol className="flex flex-row items-center justify-start space-x-3 overflow-x-auto p-3">
              <li className="flex min-h-[100px] flex-col items-start rounded-md bg-slate-500 py-3 px-6">
                <p className="text-xs">The Island</p>
                <p className="font-bold uppercase">Sussymen</p>
                <hr className="mb-2 h-1 w-full rounded border-0 bg-gray-100 dark:bg-gray-700"></hr>
                <div className="flex flex-row space-y-2">
                  <div className="flex flex-row items-center space-x-6">
                    <div className="flex flex-col items-start">
                      <p className="text-xs font-light">16 Jan</p>
                      <p className="text-sm font-normal">Published</p>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-xs font-light">Season 1</p>
                      <p className="text-sm font-normal">Bloody Ark</p>
                    </div>
                  </div>
                </div>
              </li>
              <li className="flex min-h-[100px] flex-col items-start rounded-md py-3 px-6 dark:bg-neutral-800 dark:text-white">
                <p className="text-xs">The Island</p>
                <p className="font-bold uppercase">Sussymen</p>
                <hr className="mb-2 h-1 w-full rounded border-0 bg-gray-100 dark:bg-gray-700"></hr>
                <div className="flex flex-row space-y-2">
                  <div className="flex flex-row items-center space-x-6">
                    <div className="flex flex-col items-start">
                      <p className="text-xs font-light">16 Jan</p>
                      <p className="text-sm font-normal">Published</p>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-xs font-light">Season 1</p>
                      <p className="text-sm font-normal">Bloody Ark</p>
                    </div>
                  </div>
                </div>
              </li>
              <li className="flex min-h-[100px] flex-col items-start rounded-md bg-slate-500 py-3 px-6">
                <p className="text-xs">The Island</p>
                <p className="font-bold uppercase">Sussymen</p>
                <hr className="mb-2 h-1 w-full rounded border-0 bg-gray-100 dark:bg-gray-700"></hr>
                <div className="flex flex-row space-y-2">
                  <div className="flex flex-row items-center space-x-6">
                    <div className="flex flex-col items-start">
                      <p className="text-xs font-light">16 Jan</p>
                      <p className="text-sm font-normal">Published</p>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-xs font-light">Season 1</p>
                      <p className="text-sm font-normal">Bloody Ark</p>
                    </div>
                  </div>
                </div>
              </li>
            </ol>
            <span className="filling-line" aria-hidden="true"></span>
          </div>
        </div>
        <ul className="cd-timeline-navigation">
          <li>
            <a href="#0" className="prev inactive">
              Prev
            </a>
          </li>
          <li>
            <a href="#0" className="next">
              Next
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Timeline;
