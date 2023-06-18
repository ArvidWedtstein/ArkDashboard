import clsx from "clsx";
import { BgColor } from "src/lib/formatters";

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
    tabColor?: BgColor;
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

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
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
                  <img
                    src={slide.url}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
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
        <div className="bg- absolute top-0 left-0 flex h-full w-full flex-row items-center justify-between font-black text-white text-opacity-75">
          <button
            className="p-3"
            onClick={() =>
              setIndex((prevIndex) =>
                prevIndex === 0 ? slides.length - 1 : prevIndex - 1
              )
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              fill="currentColor"
              className="w-8 rounded-lg p-2 transition hover:scale-125 hover:fill-white"
            >
              <path d="M234.8 36.25c3.438 3.141 5.156 7.438 5.156 11.75c0 3.891-1.406 7.781-4.25 10.86L53.77 256l181.1 197.1c6 6.5 5.625 16.64-.9062 22.61c-6.5 6-16.59 5.594-22.59-.8906l-192-208c-5.688-6.156-5.688-15.56 0-21.72l192-208C218.2 30.66 228.3 30.25 234.8 36.25z" />
            </svg>
          </button>
          <button
            className="p-3"
            onClick={() =>
              setIndex((prevIndex) =>
                prevIndex === slides.length - 1 ? 0 : prevIndex + 1
              )
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              fill="currentColor"
              className="w-8 rounded-lg p-2 transition hover:scale-125 hover:fill-white"
            >
              <path d="M85.14 475.8c-3.438-3.141-5.156-7.438-5.156-11.75c0-3.891 1.406-7.781 4.25-10.86l181.1-197.1L84.23 58.86c-6-6.5-5.625-16.64 .9062-22.61c6.5-6 16.59-5.594 22.59 .8906l192 208c5.688 6.156 5.688 15.56 0 21.72l-192 208C101.7 481.3 91.64 481.8 85.14 475.8z" />
            </svg>
          </button>
        </div>
      )}
      {controls && (
        <div className="relative bottom-0 w-full p-3 text-center">
          {slides.map(({ tabColor }, idx) => (
            <div
              key={idx}
              title={tabColor}
              className={`mx-1 inline-block h-[3px] w-[30px] flex-initial cursor-pointer ${
                tabColor ? tabColor : "bg-white"
              } bg-clip-padding p-0 transition-opacity ${
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
