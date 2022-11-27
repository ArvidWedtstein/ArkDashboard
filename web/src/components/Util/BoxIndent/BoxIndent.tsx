const BoxIndent = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="relative flex items-center justify-center before:absolute before:top-0 before:left-0 before:z-[1] before:h-full before:w-5 before:bg-gradient-to-r before:from-[#ffffff] before:via-[#ffffff] before:to-[#e3e3e3] before:blur-[1px] before:content-[''] after:absolute after:top-[1px] after:-right-[1px] after:z-[1] after:h-full after:w-[20px] after:bg-[#9d9d9d] after:blur-[1px] after:content-['']">
        <div className="before:left-[calc(100%+5px) before:bg-boxShadowGrad after:bg-boxShadowGrad absolute h-full w-full bg-[#eeeeee] before:absolute before:top-0 before:h-[200%] before:w-full before:skew-x-[45deg] before:content-[''] after:absolute after:left-[calc(100%+15px)] after:-bottom-[200%] after:h-[200%] after:w-full after:skew-x-[45deg] after:content-['']"></div>
        <div className="shadow-boxContent relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#dbdae1] to-[#a3aaba]">
          <div className="relative">{children}</div>
        </div>
      </div>
    </>
  );
};

export default BoxIndent;
