

const FileUpload = () => {
  return (
    <div id="upload" className="bg-[#f1f2f4] rounded-2xl max-w-xl w-[calc(100%-3rem)] overflow-hidden relative transition-colors shadow" data-state="0" data-ready="false"> {/* <!-- modal --> */}
      <div className="relative z-[1] flex justify-end items-center h-10 p-2"> {/* <!-- modal header --> */}
        <button className="bg-transparent text-[#454954] flex w-6 h-6 transition-colors hover:text-[#5c6270] focus-visible:text-[#5c6270]" type="button"> {/* <!-- modal close button --> */}
          <svg className="block m-auto pointer-events-none w-1/2 h-auto" viewBox="0 0 16 16" width="16px" height="16px" aria-hidden="true">
            <g fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round">
              <polyline points="1,1 15,15" />
              <polyline points="15,1 1,15" />
            </g>
          </svg>
          <span className="overflow-hidden absolute w-[1px] h-[1px]">Close</span>
        </button>
      </div>
      <div className="relative z-[1] flex flex-col pt-0 pr-8 pb-7 pl-7"> {/* <!-- modal body --> */}
        <div className="flex-1 mt-7"> {/* <!-- modal col --> */}
          {/* <!-- up --> */}
          <svg className="block m-auto w-9 h-9 stroke-[#0d4ef2]" viewBox="0 0 24 24" width="24px" height="24px" aria-hidden="true">
            <g fill="none" stroke="hsl(223,90%,50%)" stroke-width="2" strokeLinecap="round" strokeLinejoin="round">
              <circle className="-rotate-[90deg] origin-[12px_12px]" style={{ strokeDashoffset: "69.12" }} cx="12" cy="12" r="11" strokeDasharray="69.12 69.12" />
              <polyline style={{ strokeDashoffset: "14.2" }} points="7 12 12 7 17 12" strokeDasharray="14.2 14.2" /> {/* <!-- modal__icon-sdo14 --> */}
              <line style={{ strokeDashoffset: "10" }} x1="12" y1="7" x2="12" y2="17" strokeDasharray="10 10" /> {/* <!-- modal__icon-sdo10 --> */}
            </g>
          </svg>
          {/* <!-- error --> */}
          <svg className="block m-auto w-9 h-9 stroke-[#f2180d]" viewBox="0 0 24 24" width="24px" height="24px" aria-hidden="true" display="none">
            <g fill="none" stroke="hsl(3,90%,50%)" stroke-width="2" strokeLinecap="round">
              <circle className="-rotate-[90deg] origin-[12px_12px]" style={{ strokeDashoffset: "69.12" }} cx="12" cy="12" r="11" strokeDasharray="69.12 69.12" />
              <line style={{ strokeDashoffset: "14.2" }} x1="7" y1="7" x2="17" y2="17" strokeDasharray="14.2 14.2" /> {/* <!-- modal__icon-sdo14 --> */}
              <line style={{ strokeDashoffset: "14.2" }} x1="17" y1="7" x2="7" y2="17" strokeDasharray="14.2 14.2" /> {/* <!-- modal__icon-sdo14 --> */}
            </g>
          </svg>
          {/* <!-- check --> */}
          <svg className="block m-auto w-9 h-9 stroke-[#0ac241]" viewBox="0 0 24 24" width="24px" height="24px" aria-hidden="true" display="none">
            <g fill="none" stroke="hsl(138,90%,50%)" stroke-width="2" strokeLinecap="round" strokeLinejoin="round">
              <circle className="-rotate-[90deg] origin-[12px_12px]" style={{ strokeDashoffset: "69.12" }} cx="12" cy="12" r="11" strokeDasharray="69.12 69.12" />
              <polyline style={{ strokeDashoffset: "14.2" }} points="7 12.5 10 15.5 17 8.5" strokeDasharray="14.2 14.2" /> {/* <!-- modal__icon-sdo14 --> */}
            </g>
          </svg>
        </div>
        <div className="flex-1 mt-7"> {/* <!-- modal col --> */}
          <div className="modal__content"> {/* <!-- modal content --> */}
            <h2 className="text-xl leading-5 font-medium mb-6 text-center">Upload a File</h2>
            <p className="min-h-[3rem] mb-6 text-base">Select a file to upload from your computer or device.</p>
            <div className="flex items-center flex-wrap delay-200">
              <button className="hover:bg-[#8f95a3] rounded text-xs py-2 px-8 transition-colors w-full text-current focus:outline-none disabled:opacity-50 bg-transparent border border-[#737a8c] flex-1" type="button" data-action="file">Choose File</button> {/* <!-- modal button upload --> */}
              <input id="file" type="file" hidden />
            </div>
            <div className="flex items-center flex-wrap delay-200" hidden>
              <svg className="text-[#737a8c] block mr-3 w-6 h-6 transition-colors" viewBox="0 0 24 24" width="24px" height="24px" aria-hidden="true">
                <g fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="4 1 12 1 20 8 20 23 4 23" />
                  <polyline points="12 1 12 8 20 8" />
                </g>
              </svg>
              <div className="flex-1 text-xs overflow-hidden text-ellipsis whitespace-nowrap" data-file></div> {/* <!-- modal file --> */}
              <button className="text-current cursor-pointer pt-6" type="button" data-action="fileReset">
                <svg className="block m-auto pointer-events-none w-1/2 h-auto" viewBox="0 0 16 16" width="16px" height="16px" aria-hidden="true">
                  <g fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round">
                    <polyline points="4,4 12,12" />
                    <polyline points="12,4 4,12" />
                  </g>
                </svg>
                <span className="overflow-hidden absolute w-[1px] h-[1px]">Remove</span>
              </button>
              <button className="bg-[#737a8c] hover:bg-[#8f95a3] rounded text-xs py-2 px-8 transition-colors w-full text-current focus:outline-none disabled:opacity-50" type="button" data-action="upload">Upload</button> {/* <!-- modal button --> */}
            </div>
          </div>
          <div className="modal__content" hidden> {/* <!-- modal content --> */}
            <h2 className="text-xl leading-5 font-medium mb-6 text-center">Uploading…</h2>
            <p className="min-h-[3rem] mb-6 text-base">Just give us a moment to process your file.</p>
            <div className="flex items-center flex-wrap delay-200">
              <div className="flex-1">
                <div className="text-xs font-bold leading-5 text-right" data-progress-value>0%</div>
                <div className="overflow-hidden w-full h-[0.4rem]">
                  <div className="bg-[#e3e4e8] w-full h-full transition-transform" data-progress-fill></div>
                </div>
              </div>
              <button className="bg-[#737a8c] hover:bg-[#8f95a3] rounded text-xs py-2 px-8 transition-colors w-full text-current focus:outline-none disabled:opacity-50" type="button" data-action="cancel">Cancel</button> {/* <!-- modal button --> */}
            </div>
          </div>
          <div className="modal__content" hidden> {/* <!-- modal content --> */}
            <h2 className="text-xl leading-5 font-medium mb-6 text-center">Oops!</h2>
            <p className="min-h-[3rem] mb-6 text-base">Your file could not be uploaded due to an error. Try uploading it again?</p>
            <div className="flex items-center flex-wrap delay-200 modal__actions--center">
              <button className="bg-[#737a8c] hover:bg-[#8f95a3] rounded text-xs py-2 px-8 transition-colors w-full text-current focus:outline-none disabled:opacity-50" type="button" data-action="upload">Retry</button> {/* <!-- modal button --> */}
              <button className="bg-[#737a8c] hover:bg-[#8f95a3] rounded text-xs py-2 px-8 transition-colors w-full text-current focus:outline-none disabled:opacity-50 mt-3" type="button" data-action="cancel">Cancel</button> {/* <!-- modal button --> */}
            </div>
          </div>
          <div className="modal__content" hidden> {/* <!-- modal content --> */}
            <h2 className="text-xl leading-5 font-medium mb-6 text-center">Upload Successful!</h2>
            <p className="min-h-[3rem] mb-6 text-base">Your file has been uploaded. You can copy the link to your clipboard.</p>
            <div className="flex items-center flex-wrap delay-200 modal__actions--center">
              <button className="bg-[#737a8c] hover:bg-[#8f95a3] rounded text-xs py-2 px-8 transition-colors w-full text-current focus:outline-none disabled:opacity-50" type="button" data-action="copy">Copy Link</button> {/* <!-- modal button --> */}
              <button className="bg-[#737a8c] hover:bg-[#8f95a3] rounded text-xs py-2 px-8 transition-colors w-full text-current focus:outline-none disabled:opacity-50 mt-3" type="button" data-action="cancel">Done</button> {/* <!-- modal button --> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileUpload
