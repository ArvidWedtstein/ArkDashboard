const Slides = ({ slides }: { slides: any[] }) => {
  return (
    <div className="card-stack">

      {slides.map((slide, index) => (
        <>
          <input id={`card-${index}`} className="card-set" type="radio" checked={index === 0} />
          <div className="card">
            <div className="content">
              <h2>Step {index + 1}</h2>
              <p>{slide}</p>
              <label htmlFor={`card-${index + 1 === slides.length ? 0 : index + 1}`}>Learn More</label>
            </div>
          </div>
        </>
      ))}
    </div>
  )
}

export default Slides
