const Slideshow = () => {
  const colors = ["#0088FE", "#00C49F", "#FFBB28"];
  const [index, setIndex] = React.useState(0);
  const delay = 2500;

  React.useEffect(() => {
    setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === colors.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => { };
  }, [index]);


  return (
    <div className="my-0 mx-auto overflow-hidden max-w-[500px]">
      <div className="whitespace-nowrap transition-all"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
        {colors.map((backgroundColor, index) => (
          <div className="w-full h-[400px] rounded inline-block" key={index} style={{ backgroundColor }} />
        ))}
      </div>
      <div className="text-center">
        {colors.map((_, idx) => (
          <div key={idx} className="inline-block h-5 w-5 rounded-full cursor-pointer mt-4 px-2 bg-[#c4c4c4]"></div>
        ))}
      </div>
    </div>
  );
}

// https://tinloof.com/blog/how-to-build-an-auto-play-slideshow-with-react
export default Slideshow
