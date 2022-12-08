import { useAuth } from "@redwoodjs/auth";
import { useRef } from "react";

interface IFileUploadProps {
  onUpload?: (url) => void;
  className?: string;
  multiple?: boolean;
}
const FileUpload = ({ onUpload }: IFileUploadProps) => {
  let filename = "";
  let files = [];
  let isCopying,
    isUploading = false;
  let progress = 0;
  let progressTimeout = null;
  let state = 0;
  let el = useRef(null);
  const { client: supabase } = useAuth();

  function fileHandle(e) {
    stateDisplay();
    return new Promise(() => {
      const { target } = e;
      if (target?.files.length) {
        let reader = new FileReader();
        reader.onload = e2 => {
          files = Array.from(target.files);
          fileDisplay(files.length > 1 ? `${files.length} files` : target.files[0].name);
        };
        reader.readAsDataURL(target.files[0]);
      }
    });
  }
  function stateDisplay() {
    el.current.setAttribute("data-state", `${state}`);
  }
  function fileDisplay(name = "") {
    // update the name
    filename = name;

    const fileValue = el.current.querySelector("[data-file]");
    if (fileValue) fileValue.textContent = filename;

    // show the file
    el?.current.setAttribute("data-ready", filename ? "true" : "false");
  }
  function cancel() {

    isUploading = false;
    progress = 0;
    progressTimeout = null;
    state = 0;
    stateDisplay();
    progressDisplay();
    fileReset();
  }
  function fileReset() {
    const fileField: any = el?.current.querySelector("#file");
    if (fileField) fileField.value = null;

    fileDisplay();
  }
  function progressDisplay() {
    const progressValue = el?.current.querySelector("[data-progress-value]");
    const progressFill: any = el?.current.querySelector("[data-progress-fill]");
    const progressTimes100 = Math.floor(progress * 100);

    if (progressValue) progressValue.textContent = `${progressTimes100}%`;
    if (progressFill) progressFill.style.transform = `translateX(${progressTimes100}%)`;
  }
  function file() {
    let t: any = el?.current.querySelector("#file");
    t.click();
    stateDisplay();
  }
  function upload() {
    if (!isUploading) {
      isUploading = true;
      progress = 0;
      state = 1;

      try {
        files.forEach(async file => {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          let { error: uploadError } = await supabase.storage
            .from("basespotimages/thumbnails")
            .upload(filePath, file);

          if (uploadError) {
            fail();
          }
          onUpload && onUpload(filePath);
        });
        progressLoop();
      } catch (error) {
        fail();
      } finally {
        success();
      }
    }
    stateDisplay();
  }
  function fail() {
    isUploading = false;
    progress = 0;
    progressTimeout = null;
    state = 2;
    stateDisplay();
  }
  async function progressLoop() {
    progressDisplay();

    try {
      if (isUploading) {
        if (progress === 0) {
          await new Promise(res => setTimeout(res, 1000));

          if (!isUploading) {
            return;
          }
        }

        if (progress < 1) {
          progress += 0.01;
          progressTimeout = setTimeout(progressLoop.bind(this), 50);
        } else if (progress >= 1) {
          progressTimeout = setTimeout(() => {
            if (isUploading) {
              success();
              stateDisplay();
              progressTimeout = null;
            }
          }, 250);
        }
      }
    } catch (error) {
      fail();
    }
  }
  function success() {
    isUploading = false;
    state = 3;
    stateDisplay();
  }

  async function copy() {
    const copyButton: any = el?.current.querySelector("[data-action='copy']");

    if (!isCopying && copyButton) {
      // disable
      isCopying = true;
      copyButton.style.width = `${copyButton.offsetWidth}px`;
      copyButton.disabled = true;
      copyButton.textContent = "Copied!";
      navigator.clipboard.writeText(filename);
      await new Promise(res => setTimeout(res, 1000));
      // reenable
      isCopying = false;
      copyButton.removeAttribute("style");
      copyButton.disabled = false;
      copyButton.textContent = "Copy Link";
    }
  }

  return (
    <div ref={el} className={`bg-[#f1f2f4] rounded-2xl max-w-xl w-[calc(100%-3rem)] overflow-hidden relative transition-colors shadow group ${state === 2 ? "before:bg-[#f5463d]" : ""} ${state === 3 ? "before:bg-[#3df574]" : ""}`} data-state="0" data-ready="false"> {/* <!-- modal --> */}
      <div className="relative z-[1] flex flex-col pt-0 pr-8 pb-7 pl-7"> {/* <!-- modal body --> */}
        <div className="flex-1 mt-7"> {/* <!-- modal col --> */}
          {/* <!-- up --> */}
          <svg className="block z-[1] m-auto w-9 h-9 stroke-[#0d4ef2] text-black modal__icon" viewBox="0 0 24 24" width="24px" height="24px" aria-hidden="true">
            <g fill="none" stroke="hsl(223,90%,50%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle className="-rotate-[90deg] origin-[12px_12px]" style={{ strokeDashoffset: "69.12" }} cx="12" cy="12" r="11" strokeDasharray="69.12 69.12" />
              <polyline style={{ strokeDashoffset: "14.2" }} points="7 12 12 7 17 12" strokeDasharray="14.2 14.2" /> {/* <!-- modal__icon-sdo14 --> */}
              <line style={{ strokeDashoffset: "10" }} x1="12" y1="7" x2="12" y2="17" strokeDasharray="10 10" /> {/* <!-- modal__icon-sdo10 --> */}
            </g>
          </svg>
          {/* <!-- error --> */}
          <svg className="block m-auto w-9 h-9 stroke-[#f2180d] modal__icon" viewBox="0 0 24 24" width="24px" height="24px" aria-hidden="true" display="none">
            <g fill="none" stroke="hsl(3,90%,50%)" strokeWidth="2" strokeLinecap="round">
              <circle className="-rotate-[90deg] origin-[12px_12px]" style={{ strokeDashoffset: "69.12" }} cx="12" cy="12" r="11" strokeDasharray="69.12 69.12" />
              <line style={{ strokeDashoffset: "14.2" }} x1="7" y1="7" x2="17" y2="17" strokeDasharray="14.2 14.2" /> {/* <!-- modal__icon-sdo14 --> */}
              <line style={{ strokeDashoffset: "14.2" }} x1="17" y1="7" x2="7" y2="17" strokeDasharray="14.2 14.2" /> {/* <!-- modal__icon-sdo14 --> */}
            </g>
          </svg>
          {/* <!-- check --> */}
          <svg className="block m-auto w-9 h-9 stroke-[#0ac241] modal__icon" viewBox="0 0 24 24" width="24px" height="24px" aria-hidden="true" display="none">
            <g fill="none" stroke="hsl(138,90%,50%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle className="-rotate-[90deg] origin-[12px_12px]" style={{ strokeDashoffset: "69.12" }} cx="12" cy="12" r="11" strokeDasharray="69.12 69.12" />
              <polyline style={{ strokeDashoffset: "14.2" }} points="7 12.5 10 15.5 17 8.5" strokeDasharray="14.2 14.2" /> {/* <!-- modal__icon-sdo14 --> */}
            </g>
          </svg>
        </div>
        <div className="flex-1 mt-7"> {/* <!-- modal col --> */}
          <div className="modal__content"> {/* <!-- modal content --> */}
            <h2 className="text-xl leading-5 font-medium mb-6 text-center">Upload a File</h2>
            <p className="min-h-[3rem] mb-6 text-base">Select a file to upload from your computer or device.</p>
            <div className="flex items-center flex-wrap delay-200 "> {/* <!-- modal actions --> */}
              <button className="hover:bg-[#8f95a3] rounded text-xs py-2 px-8 transition-colors w-full text-current focus:outline-none disabled:opacity-50 bg-transparent border-2 border-[#737a8c] border-dashed flex-1 " type="button" onClick={file}>Choose File</button> {/* <!-- modal button upload --> */}
              <input id="file" onChange={fileHandle} type="file" hidden />
            </div>
            <div className={`group-data-[ready=true]:flex group-data-[ready=false]:hidden items-center flex-wrap delay-200`}> {/* <!-- modal actions --> */}
              <svg className="text-[#737a8c] block mr-3 w-6 h-6 transition-colors" viewBox="0 0 24 24" width="24px" height="24px" aria-hidden="true">
                <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="4 1 12 1 20 8 20 23 4 23" />
                  <polyline points="12 1 12 8 20 8" />
                </g>
              </svg>
              <div className="flex-1 text-xs overflow-hidden text-ellipsis whitespace-nowrap" data-file></div> {/* <!-- modal file --> */}
              <button className="text-current cursor-pointer pt-6" type="button" onClick={fileReset}>
                <svg className="block m-auto pointer-events-none w-1/2 h-auto" viewBox="0 0 16 16" width="16px" height="16px" aria-hidden="true">
                  <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="4,4 12,12" />
                    <polyline points="12,4 4,12" />
                  </g>
                </svg>
                <span className="overflow-hidden absolute w-[1px] h-[1px]">Remove</span>
              </button>
              <button className="bg-[#737a8c] hover:bg-[#8f95a3] rounded text-xs py-2 px-4 transition-colors w-full text-current focus:outline-none disabled:opacity-50" type="button" onClick={upload}>Upload</button> {/* <!-- modal button --> */}
            </div>
          </div>
          <div className="modal__content" hidden> {/* <!-- modal content --> */}
            <h2 className="text-xl leading-5 font-medium mb-6 text-center">Uploading…</h2>
            <p className="min-h-[3rem] mb-6 text-base text-center">Just give us a moment to process your file.</p>
            <div className="flex items-center flex-wrap delay-200">
              <div className="flex-1">
                <div className="text-xs font-bold leading-5 text-right" data-progress-value>0%</div>
                <div className="overflow-hidden w-full h-[0.4rem]">
                  <div className="bg-[#e3e4e8] w-full h-full transition-transform" data-progress-fill></div>
                </div>
              </div>
              <button className="bg-[#737a8c] hover:bg-[#8f95a3] rounded text-xs py-2 px-8 transition-colors w-full text-current focus:outline-none disabled:opacity-50" type="button" onClick={cancel}>Cancel</button> {/* <!-- modal button --> */}
            </div>
          </div>
          <div className="modal__content" hidden> {/* <!-- modal content --> */}
            <h2 className="text-xl leading-5 font-medium mb-6 text-center">Oops!</h2>
            <p className="min-h-[3rem] mb-6 text-base">Your file could not be uploaded due to an error. Try uploading it again?</p>
            <div className="flex items-center flex-wrap delay-200">
              <button className="bg-[#737a8c] hover:bg-[#8f95a3] rounded text-xs py-2 px-8 transition-colors w-full text-current focus:outline-none disabled:opacity-50" type="button" onClick={upload}>Retry</button> {/* <!-- modal button --> */}
              <button className="bg-[#737a8c] hover:bg-[#8f95a3] rounded text-xs py-2 px-8 transition-colors w-full text-current focus:outline-none disabled:opacity-50 mt-3" type="button" onClick={cancel}>Cancel</button> {/* <!-- modal button --> */}
            </div>
          </div>
          <div className="modal__content" hidden> {/* <!-- modal content --> */}
            <h2 className="text-xl leading-5 font-medium mb-6 text-center">Upload Successful!</h2>
            <p className="min-h-[3rem] mb-6 text-base">Your file has been uploaded. You can copy the link to your clipboard.</p>
            <div className="flex items-center flex-wrap delay-200">
              <button className="bg-[#737a8c] hover:bg-[#8f95a3] rounded text-xs py-2 px-8 transition-colors w-full text-current focus:outline-none disabled:opacity-50" type="button" data-action="copy" onClick={copy}>Copy Link</button> {/* <!-- modal button --> */}
              <button className="bg-[#737a8c] hover:bg-[#8f95a3] rounded text-xs py-2 px-8 transition-colors w-full text-current focus:outline-none disabled:opacity-50 mt-3" type="button" onClick={cancel}>Done</button> {/* <!-- modal button --> */}
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default FileUpload
