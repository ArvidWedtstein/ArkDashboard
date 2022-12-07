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
      <div className="whitespace-nowrap transition ease-in-out duration-1000"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
        {slides.map((slide, indegs) => (
          <div className="w-full h-[400px] rounded inline-block" key={indegs} style={{ display: `${indegs === Number(`${indegs === slides.length - 1 ? 0 : index}`) ? 'block' : 'none'}` }}>
            {slide && <img src={slide.url} className="w-full h-full object-cover" />}
          </div>
        ))}
      </div>
      <div className="text-center bg-gray-700">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={`inline-block w-[30px] h-[3px] p-0 flex-initial ml-[3px] mr-[3px] cursor-pointer bg-white bg-clip-padding transition-opacity ${index === idx ? "opacity-100" : "opacity-50"}`}
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
