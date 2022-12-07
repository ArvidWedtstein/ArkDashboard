interface ISlideshowProps {
  images?: string[];
}
const Slideshow = ({ images }: ISlideshowProps) => {
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000"];
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
          prevIndex === colors.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <div className="my-0 mx-auto overflow-hidden max-w-[500px]">
      <div className="whitespace-nowrap transition ease-in-out duration-500"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
        {images.map((url, index) => (
          <div className="w-full h-[400px] rounded inline-block" key={index}>
            {images && <img src={url} className="w-full h-full object-cover" />}
          </div>
        ))}
      </div>
      <div className="text-center">
        {colors.map((_, idx) => (
          <div
            key={idx}
            className={`inline-block h-5 w-5 rounded-full cursor-pointer mt-4 px-2 ${index === idx ? "bg-green-700" : "bg-[#c4c4c4]"}`}
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
