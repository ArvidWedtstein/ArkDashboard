const Slides = ({ slides }: { slides: any[] }) => {
  return (
    <div className="relative w-64 ml-auto mr-auto mt-4 will-change-transform">

      {slides.map((slide, index) => (
        <>
          <input id={`card-${index}`} className="card-set" type="radio" checked={index === 0} />
          <div className="card flex absolute top-0 w-full bg-white opacity-0 rounded justify-center items-center before:content-[''] before:block">
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
