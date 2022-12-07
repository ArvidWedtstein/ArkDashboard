interface ISlideshowProps {
  slides: {
    url: string;
    title?: string;
    subtitle?: string;
  }[];
}
const Slideshow = ({ slides }: ISlideshowProps) => {
  const [index, setIndex] = React.useState(0);
  const timeoutRef = React.useRef(null);
  const delay = 5000;


  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }
  React.useEffect(() => {
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
  }, [index]);

  return (
    <div className="my-0 mx-auto overflow-hidden max-w-[500px]">
      <div className="transition ease-in-out duration-1000"
      > {/* whitespace-nowrap  style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }} */}
        {slides.map((slide, indegs) => (
          <div className={`absolute left-0 ${indegs === index ? 'opacity-100' : 'opacity-0'}`} key={indegs} style={{ opacity: `${indegs === index ? '100' : '0'}` }}> {/* w-full h-[400px] rounded inline-block */}
            {slide && <img src={slide.url} className="w-full h-full object-cover" />}
          </div>
        ))}
      </div>
      <div className="text-center bg-gray-700">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={`inline-block w-[30px] h-[3px] p-0 flex-initial mx-1 cursor-pointer bg-white bg-clip-padding transition-opacity ${index === idx ? "opacity-100" : "opacity-50"}`}
            onClick={() => {
              setIndex(idx);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

// https://tinloof.com/blog/how-to-build-an-auto-play-slideshow-with-react
export default Slideshow
