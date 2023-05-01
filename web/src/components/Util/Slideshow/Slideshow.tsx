import clsx from "clsx";

interface ISlideshowProps {
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  delay?: number;
  slides: {
    url?: string;
    content?: React.ReactNode;
    title?: string;
    subtitle?: string;
  }[];
}
const Slideshow = ({
  slides,
  className,
  controls = true,
  autoPlay = true,
  delay = 5000,
  ...props
}: ISlideshowProps) => {
  const [index, setIndex] = React.useState(0);
  const timeoutRef = React.useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }
  React.useEffect(() => {
    if (!autoPlay || slides.length === 1) return;
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index, autoPlay]);

  return (
    <div className={clsx("relative my-0 mx-auto", className)} {...props}>
      <div
        className="whitespace-nowrap transition-transform duration-500 ease-in-out"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
        {slides.map((slide, indegs) => (
          <div
            className="relative inline-block h-[400px] w-full rounded"
            key={indegs}
          >
            {slide && (
              <>
                {slide.content && !slide.url ? (
                  <div className="relative top-0 bottom-0 left-0 right-0 h-full w-full">
                    {slide.content}
                  </div>
                ) : (
                  <img src={slide.url} className="h-full w-full object-cover" />
                )}

                {(slide.title || slide.subtitle) && (
                  <div className="absolute top-0 left-0 flex h-full w-full flex-col items-start justify-end">
                    <div className="relative my-1 mx-3 divide-y rounded-lg bg-gray-700 bg-opacity-40 px-3 py-2 text-gray-300">
                      <p className="text-sm font-medium">{slide.title}</p>
                      <p className="text-xs font-light">{slide.subtitle}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      {controls && slides.length > 1 && (
        <div className="absolute top-0 left-0 flex h-full w-full flex-row items-center justify-between font-black text-white text-opacity-75">
          <button
            className="p-3"
            onClick={() =>
              setIndex((prevIndex) =>
                prevIndex === 0 ? slides.length - 1 : prevIndex - 1
              )
            }
          >
            {"<"}
          </button>
          <button
            className="p-3"
            onClick={() =>
              setIndex((prevIndex) =>
                prevIndex === slides.length - 1 ? 0 : prevIndex + 1
              )
            }
          >
            {">"}
          </button>
        </div>
      )}
      {controls && (
        <div className="relative bottom-0 w-full p-3 text-center">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`mx-1 inline-block h-[3px] w-[30px] flex-initial cursor-pointer bg-white bg-clip-padding p-0 transition-opacity ${
                index === idx ? "opacity-100" : "opacity-50"
              }`}
              onClick={() => {
                setIndex(idx);
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

// https://tinloof.com/blog/how-to-build-an-auto-play-slideshow-with-react
export default Slideshow;
