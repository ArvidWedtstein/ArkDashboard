interface ISlideshowProps {
  controls?: boolean;
  slides: {
    url: string;
    title?: string;
    subtitle?: string;
  }[];
}
const Slideshow = ({ slides, controls = true }: ISlideshowProps) => {
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
    <div className="my-0 mx-auto overflow-hidden max-w-[500px] relative">
      <div className="whitespace-nowrap transition ease-in-out duration-1000"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
        {slides.map((slide, indegs) => (
          <div className="w-full h-[400px] rounded inline-block" key={indegs}>
            {slide && <img src={slide.url} className="w-full h-full object-cover" />}
          </div>
        ))}
      </div>
      {controls && <div className="absolute top-0 left-0 flex flex-row w-full justify-between items-center h-full text-white text-opacity-75 font-black">
        <button className="p-3" onClick={() => setIndex((prevIndex) =>
          prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        )}>
          {"<"}
        </button>
        <button className="p-3" onClick={() => setIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        )}>
          {">"}
        </button>
      </div>}
      {controls && <div className="text-center absolute bottom-0 w-full p-3">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={`inline-block w-[30px] h-[3px] p-0 flex-initial mx-1 cursor-pointer bg-white bg-clip-padding transition-opacity ${index === idx ? "opacity-100" : "opacity-50"}`}
            onClick={() => {
              setIndex(idx);
            }}
          ></div>
        ))}
      </div>}
    </div>
  );
}

// https://tinloof.com/blog/how-to-build-an-auto-play-slideshow-with-react
export default Slideshow
