const Slides = ({ slides }: { slides: any[] }) => {
  return (
    <div className="relative slides-stack">

      {slides.map((slide, index) => (
        <>
          <input id={`slide-${index}`} className="slides-set" type="radio" checked={index === 0} />
          <div className="slide">
            <div className="content">
              <h2>Step {index + 1}</h2>
              <p>{slide}</p>
              <label htmlFor={`slide-${index + 1 === slides.length ? 0 : index + 1}`}>Learn More</label>
            </div>
          </div>
        </>
      ))}
    </div>
  )
}

export default Slides
