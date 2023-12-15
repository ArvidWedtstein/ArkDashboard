import clsx from "clsx";
import { useCallback, useEffect, useState, useRef, forwardRef, cloneElement } from "react";
import { ArrayElement } from "src/lib/formatters";
import { TransitionGroup, CSSTransition, Transition } from 'react-transition-group';
import Button from "../Button/Button";
import { Card, CardActionArea, CardContent, CardHeader, CardMedia, CardProps } from "../Card/Card";

type SlideshowProps = {
  className?: string;
  controls?: boolean;
  arrows?: boolean;
  autoPlay?: boolean;
  imageTabs?: boolean;
  delay?: number;
  slide?: number;
  CardProps?: CardProps;
  onSlideChange?: (index: number) => void;
  renderSlide?: (slide: ArrayElement<SlideshowProps["slides"]>, index: number) => React.ReactNode;
  slides: {
    url?: string;
    content?: React.ReactNode;
    title?: string;
    subtitle?: string;
  }[];
}
const Slideshow = forwardRef<HTMLDivElement, SlideshowProps>((props, ref) => {
  const {
    slides,
    className,
    controls = true,
    arrows = true,
    autoPlay = true,
    imageTabs = false,
    delay = 5000,
    onSlideChange,
    renderSlide,
    slide = 0,
    CardProps,
    ...other
  } = props;
  const [state, setState] = useState<{ slideNo: number; slideDirection: 'left' | 'right' }>({
    slideNo: slide || 0,
    slideDirection: 'right',
  });

  const timeoutRef = useRef(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    const playSlideshow = () => {
      const currentSlide = state.slideNo;
      setState((prevState) => ({
        slideNo: (prevState.slideNo === slides.length - 1 ? 0 : prevState.slideNo + 1),
        slideDirection: (prevState.slideNo === slides.length - 1 ? 0 : prevState.slideNo + 1) < prevState.slideNo ? 'right' : 'left'
      }))
      onSlideChange?.(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    };

    if (autoPlay && slides.length > 1) {
      resetTimeout();
      timeoutRef.current = window.setTimeout(playSlideshow, delay);
    }

    return () => {
      resetTimeout();
    };
  }, [state, autoPlay, delay, resetTimeout, slides.length, onSlideChange]);

  useEffect(() => {
    if (slide) {
      setState({ slideNo: slide, slideDirection: 'left' })
    }
  }, [slide]);

  const handlePrevSlide = useCallback(() => {
    const currentSlide = state.slideNo;
    const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;

    setState({ slideNo: prevIndex, slideDirection: 'right' })
    onSlideChange?.(prevIndex);
  }, [state, slides.length, onSlideChange]);

  const handleNextSlide = useCallback(() => {
    const currentSlide = state.slideNo;
    const nextIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;

    setState({ slideNo: nextIndex, slideDirection: 'left' })
    onSlideChange?.(nextIndex);
  }, [state, slides.length, onSlideChange]);

  const childFactoryCreator = (slideDirection: 'left' | 'right') => (child) => {
    return cloneElement(child, {
      classNames: slideDirection,
    });
  };

  return (
    <div className={clsx("relative my-0 w-full overflow-x-hidden", className)} {...other} ref={ref}>
      <div className="flex justify-center items-center relative overflow-hidden">
        <TransitionGroup
          childFactory={childFactoryCreator(state.slideDirection)}
          className="relative"
        >
          <CSSTransition
            key={state.slideNo}
            classNames={state.slideDirection}
            timeout={1000}
          >
            <div className="slide">
              <Card
                key={`slide-${state?.slideNo}`}
                variant="outlined"
                className={clsx("w-full overflow-hidden max-h-[900px] h-fit inline-block", CardProps?.className)}
                {...CardProps}
              >
                {renderSlide ? renderSlide(slides[state?.slideNo], state?.slideNo) : (
                  <>
                    {slides[state.slideNo].content && !slides[state.slideNo].url ? (
                      <CardContent>
                        {slides[state.slideNo].content}
                      </CardContent>
                    ) : (
                      <CardMedia
                        image={slides[state.slideNo].url}
                        loading="lazy"
                        className="h-full max-h-fit w-full object-cover rounded-[inherit] object-center"
                      />
                    )}

                    {(slides[state.slideNo].title || slides[state.slideNo].subtitle) && (
                      <CardHeader
                        title={slides[state.slideNo].title}
                        subheader={slides[state.slideNo].subtitle}
                      />
                    )}
                  </>
                )}
              </Card>
            </div>
          </CSSTransition>
        </TransitionGroup>

        {arrows && slides.length > 1 && (
          <div className="absolute inset-0 flex h-full w-full flex-row items-center justify-between font-black text-white text-opacity-75">
            <Button
              variant="icon"
              color="DEFAULT"
              onClick={handlePrevSlide}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="fill-current w-8"
              >
                <path d="M234.8 36.25c3.438 3.141 5.156 7.438 5.156 11.75c0 3.891-1.406 7.781-4.25 10.86L53.77 256l181.1 197.1c6 6.5 5.625 16.64-.9062 22.61c-6.5 6-16.59 5.594-22.59-.8906l-192-208c-5.688-6.156-5.688-15.56 0-21.72l192-208C218.2 30.66 228.3 30.25 234.8 36.25z" />
              </svg>
            </Button>
            <Button
              variant="icon"
              color="DEFAULT"
              onClick={handleNextSlide}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="fill-current w-8"
              >
                <path d="M85.14 475.8c-3.438-3.141-5.156-7.438-5.156-11.75c0-3.891 1.406-7.781 4.25-10.86l181.1-197.1L84.23 58.86c-6-6.5-5.625-16.64 .9062-22.61c6.5-6 16.59-5.594 22.59 .8906l192 208c5.688 6.156 5.688 15.56 0 21.72l-192 208C101.7 481.3 91.64 481.8 85.14 475.8z" />
              </svg>
            </Button>
          </div>
        )}
      </div>
      {controls && slides.length > 1 && (
        <div className="relative w-full p-3 text-center">
          {slides.map(({ title }, idx) => (
            <div
              key={`slide-control-${idx}`}
              title={title || `Slide ${idx + 1}`}
              className={clsx(`mx-1 inline-block h-[3px] w-[30px] flex-initial cursor-pointer bg-pea-500 bg-clip-padding p-0 transition-opacity`, {
                "opacity-100": state.slideNo === idx,
                "opacity-50": state.slideNo !== idx
              })}
              onClick={() => {
                setState((prevState) => ({
                  slideNo: idx,
                  slideDirection: idx < prevState.slideNo ? 'right' : 'left'
                }))
                onSlideChange?.(idx);
              }}
            ></div>
          ))}
        </div>
      )}

      {imageTabs && (
        <div className="relative grid grid-cols-5 flex-nowrap gap-4 overflow-hidden">
          {slides.map(({ url, title }, idx) => (
            <Card key={`image-slider-${idx}`} variant="outlined" className="hover:border-pea-500 border border-transparent transition-all cursor-pointer ease-in-out">
              <CardActionArea onClick={() => {
                setState((prevState) => ({
                  slideNo: idx,
                  slideDirection: idx < prevState.slideNo ? 'right' : 'left'
                }))
                onSlideChange?.(idx);
              }}
                className="h-full overflow-hidden"
              >
                <CardMedia
                  className="h-full object-cover object-center"
                  image={url}
                  loading="lazy"
                />
              </CardActionArea>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
});

// https://tinloof.com/blog/how-to-build-an-auto-play-slideshow-with-react
export default React.memo(Slideshow, (prevProps, nextProps) => {
  // Memoize the component based on the slides prop
  return prevProps.slides === nextProps.slides;
});