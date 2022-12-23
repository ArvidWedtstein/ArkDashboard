const Timeline = () => {
  return (
    <section>
      <div className="timeline">
        <div className="events-wrapper">
          <div className="events">
            <ol>
              <li>
                <a href="#0" data-date="16/01/2014" className="selected">
                  16 Jan
                </a>
              </li>
            </ol>
            <span className="filling-line" aria-hidden="true"></span>
          </div>
        </div>
        <ul className="cd-timeline-navigation">
          <li>
            <a href="#0" className="prev inactive">
              Prev
            </a>
          </li>
          <li>
            <a href="#0" className="next">
              Next
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Timeline;
