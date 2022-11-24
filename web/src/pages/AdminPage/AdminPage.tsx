import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const AdminPage = () => {
  return (
    <>
      <MetaTags title="Admin" description="Admin page" />

      <div className="container-xl p-3 text-center overflow-hidden">
        <div className="app-main-right cards-area">
          <div className="app-main-right-header">
            <span>Latest Deals</span>
            <a href="#">See More</a>
          </div>
          <div className="card-wrapper main-card">
            <a className="card cardItemjs">
              <div className="card-image-wrapper">
                <img src="https://source.unsplash.com/featured/1200x900/?hotel-room,interior" />
              </div>
              <div className="card-info">
                <div className="card-text big cardText-js">Hotel Conrad</div>
                <div className="card-text small">Stockton Street</div>
                <div className="card-text small">
                  Starts from:
                  <span className="card-price"> $1000</span>
                </div>
              </div>
            </a>
          </div>
          <div className="card-wrapper main-card">
            <a className="card cardItemjs">
              <div className="card-image-wrapper">
                <img src="https://source.unsplash.com/featured/1200x900/?interior,hotel" />
              </div>
              <div className="card-info">
                <div className="card-text big cardText-js">The Hotel Riviera</div>
                <div className="card-text small">Stockton Street</div>
                <div className="card-text small">
                  Starts from:
                  <span className="card-price"> $300</span>
                </div>
              </div>
            </a>
          </div>
          <div className="card-wrapper main-card">
            <a className="card cardItemjs">
              <div className="card-image-wrapper">
                <img src="https://source.unsplash.com/featured/1200x900/?architecture,modern" />
              </div>
              <div className="card-info">
                <div className="card-text big cardText-js">The Hotel Star Pasific</div>
                <div className="card-text small">Stockton Street</div>
                <div className="card-text small">
                  Starts from:
                  <span className="card-price"> $1400</span>
                </div>
              </div>
            </a>
          </div>
          <div className="card-wrapper main-card">
            <a className="card cardItemjs">
              <div className="card-image-wrapper">
                <img src="https://source.unsplash.com/featured/1200x900/?hotel,modern" />
              </div>
              <div className="card-info">
                <div className="card-text big cardText-js">Hotel Instant Destiny </div>
                <div className="card-text small">Stockton Street</div>
                <div className="card-text small">
                  Starts from:
                  <span className="card-price"> $1800</span>
                </div>
              </div>
            </a>
          </div>
          <div className="card-wrapper main-card">
            <a className="card cardItemjs">
              <div className="card-image-wrapper">
                <img src="https://source.unsplash.com/featured/1200x900/?architecture,modern" alt="Hotel" />
              </div>
              <div className="card-info">
                <div className="card-text big cardText-js">The White Roses Hotel</div>
                <div className="card-text small">Stockton Street</div>
                <div className="card-text small">
                  Starts from:
                  <span className="card-price"> $700</span>
                </div>
              </div>
            </a>
          </div>
          <div className="card-wrapper main-card">
            <a className="card cardItemjs">
              <div className="card-image-wrapper">
                <img src="https://source.unsplash.com/featured/1200x900/?hotel,modern" alt="Hotel" />
              </div>
              <div className="card-info">
                <div className="card-text big cardText-js">Hotel Tom's Dinner</div>
                <div className="card-text small">Stockton Street</div>
                <div className="card-text small">
                  Starts from:
                  <span className="card-price"> $1500</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminPage
