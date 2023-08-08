import clsx from "clsx";
import { useCallback, useEffect, useState, useRef } from "react";
import { BgColor } from "src/lib/formatters";

interface ISlideshowProps {
  className?: string;
  controls?: boolean;
  arrows?: boolean;
  autoPlay?: boolean;
  imageTabs?: boolean;
  delay?: number;
  slide?: number;
  border?: boolean;
  onSlideChange?: (index: number) => void;
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
  arrows = true,
  autoPlay = true,
  imageTabs = false,
  delay = 5000,
  onSlideChange,
  slide = 0,
  border = true,
  ...props
}: ISlideshowProps) => {
  const [index, setIndex] = useState<number>(slide);
  const timeoutRef = useRef(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    const playSlideshow = () => {
      setIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
      onSlideChange?.(index === slides.length - 1 ? 0 : index + 1);
    };

    if (autoPlay && slides.length > 1) {
      resetTimeout();
      timeoutRef.current = window.setTimeout(playSlideshow, delay);
    }

    return () => {
      resetTimeout();
    };
  }, [index, autoPlay, delay, resetTimeout, slides.length, onSlideChange]);

  useEffect(() => {
    if (slide) {
      setIndex(slide);
    }
  }, [slide]);

  const handlePrevSlide = useCallback(() => {
    const prevIndex = index === 0 ? slides.length - 1 : index - 1;
    setIndex(prevIndex);
    onSlideChange?.(prevIndex);
  }, [index, slides.length, onSlideChange]);

  const handleNextSlide = useCallback(() => {
    const nextIndex = index === slides.length - 1 ? 0 : index + 1;
    setIndex(nextIndex);
    onSlideChange?.(nextIndex);
  }, [index, slides.length, onSlideChange]);


  return (
    <div className={clsx("relative my-0 w-full overflow-x-hidden", className)} {...props}>
      <div
        className={`whitespace-nowrap w-full transition-transform duration-500 ease-in-out`}
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
        {slides.map((slide, idx) => (
          <div
            className={`relative aspect-auto w-full max-h-[900px] inline-block rounded-lg ${border ? 'border border-zinc-500' : 'border-none'}`}
            key={`slide-${idx}`}
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
                    className="h-full w-full object-cover rounded-lg"
                    loading="lazy"
                  />
                )}

                {(slide.title || slide.subtitle) && (
                  <div className="absolute top-0 left-0 flex h-full w-full flex-col items-start justify-end">
                    <div className="relative my-1 mx-3 divide-y rounded-lg bg-zinc-700/60 bg-opacity-40 px-3 py-2 text-gray-300 border border-zinc-500 border-opacity-60">
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
      {arrows && slides.length > 1 && (
        <div className="absolute top-0 left-0 bottom-0 flex h-full w-full flex-row items-center justify-between font-black text-white text-opacity-75">
          <button className="p-3" onClick={handlePrevSlide}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              fill="currentColor"
              className="w-8 rounded-lg p-2 transition hover:scale-125 hover:fill-white"
            >
              <path d="M234.8 36.25c3.438 3.141 5.156 7.438 5.156 11.75c0 3.891-1.406 7.781-4.25 10.86L53.77 256l181.1 197.1c6 6.5 5.625 16.64-.9062 22.61c-6.5 6-16.59 5.594-22.59-.8906l-192-208c-5.688-6.156-5.688-15.56 0-21.72l192-208C218.2 30.66 228.3 30.25 234.8 36.25z" />
            </svg>
          </button>
          <button className="p-3" onClick={handleNextSlide}>
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
      {controls && slides.length > 1 && (
        <div className="relative w-full p-3 text-center">
          {slides.map(({ tabColor }, idx) => (
            <div
              key={`slide-control-${idx}`}
              title={tabColor}
              className={`mx-1 inline-block h-[3px] w-[30px] flex-initial cursor-pointer ${tabColor ? tabColor : "bg-white"
                } bg-clip-padding p-0 transition-opacity ${index === idx ? "opacity-100" : "opacity-50"
                }`}
              onClick={() => {
                setIndex(idx);
                onSlideChange?.(idx);
              }}
            ></div>
          ))}
        </div>
      )}
      {imageTabs && (
        <div className="relative grid grid-cols-5 flex-nowrap gap-4 overflow-hidden">
          {slides.map(({ url, title }, idx) => (
            <div
              key={`image-slider-${idx}`}
              className="rounded-lg border border-zinc-500 transition-all ease-in hover:rounded-[50px] cursor-pointer"
              onClick={() => {
                setIndex(idx);
                onSlideChange?.(idx);
              }}
            >
              <img
                className="aspect-auto w-full rounded-lg object-cover"
                src={url}
                alt={title}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// https://tinloof.com/blog/how-to-build-an-auto-play-slideshow-with-react
export default React.memo(Slideshow, (prevProps, nextProps) => {
  // Memoize the component based on the slides prop
  return prevProps.slides === nextProps.slides;
});