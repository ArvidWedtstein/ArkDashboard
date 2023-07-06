import { MetaTags } from "@redwoodjs/web"
import { useMemo } from "react"
import StatCard from "src/components/Util/StatCard/StatCard"
import Table from "src/components/Util/Table/Table"
import { formatNumber, relativeDate, rtf } from "src/lib/formatters"
import { FindAdminData } from "types/graphql"

const Admin = ({ basespots }: FindAdminData) => {
  const optimizedBasespots = useMemo(() => {
    return basespots.map((base) => {
      const totalSteps = 5;
      const missingSteps: string[] = [];
      let completedSteps = 0;

      if (base.description && base.description.length < 70) {
        completedSteps += 0.5;
      }
      if (base.description && base.description.length >= 70) {
        completedSteps += 1
      } else {
        missingSteps.push("Add longer description")
      }

      if (base.image) {
        completedSteps += 1
      } else {
        missingSteps.push("Add preview image")
      }

      if (base.estimated_for_players) {
        completedSteps += 1
      } else {
        missingSteps.push("Add estimated for players / tribe size")
      }

      if (base.latitude && base.latitude > 0 && base.longitude && base.longitude > 0) {
        completedSteps += 1
      } else {
        missingSteps.push("Add location coords")
      }

      if (base.type) {
        completedSteps += 1
      } else {
        missingSteps.push("Add spot type e.g cave, rathole, ceiling")
      }
      return {
        ...base,
        progress: (completedSteps / totalSteps) * 100,
        missingSteps: missingSteps.join(',\n')
      }
    })
  }, [basespots])

  return (
    <>
      <MetaTags title="Admin" description="Admin page" />

      <div className="container-xl overflow-hidden p-3 text-center m-4">
        <div className="flex flex-col-reverse md:flex-row space-x-3 mb-3">
          <StatCard stat={"Finsihed Basespots"} value={formatNumber((optimizedBasespots.filter((b) => b.progress == 100).length / optimizedBasespots.length) * 100, { maximumSignificantDigits: 3 })} valueof={100} />
          <StatCard stat={"Test"} value={10} />
          <StatCard stat={"Test"} value={10} />
          <StatCard stat={"Test"} value={10} />
        </div>
        <svg id="SvgjsSvg1808" width="531" height="95" xmlns="http://www.w3.org/2000/svg" version="1.1" className="apexcharts-svg" transform="translate(0, 0)">
          <foreignObject x="0" y="0" width="531" height="95">
            <div className="apexcharts-legend"></div>
          </foreignObject>
          <rect id="SvgjsRect1812" width="0" height="0" x="0" y="0" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fefefe"></rect>
          <g id="SvgjsG1849" className="apexcharts-yaxis" transform="translate(-18, 0)"></g>
          <g id="SvgjsG1810" className="apexcharts-inner apexcharts-graphical" transform="translate(0, 0)">
            <defs id="SvgjsDefs1809">
              <clipPath id="gridRectMaskf22gi0fs">
                <rect id="SvgjsRect1814" width="536" height="96" x="-2.5" y="-0.5" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect>
              </clipPath>
              <clipPath id="forecastMaskf22gi0fs"></clipPath>
              <clipPath id="nonForecastMaskf22gi0fs"></clipPath>
              <clipPath id="gridRectMarkerMaskf22gi0fs">
                <rect id="SvgjsRect1815" width="535" height="99" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect>
              </clipPath>
              <linearGradient id="SvgjsLinearGradient1820" x1="0" y1="0" x2="0" y2="1">
                <stop id="SvgjsStop1821" stop-opacity="0.65" stop-color="rgba(69,39,160,0.65)" offset="0"></stop>
                <stop id="SvgjsStop1822" stop-opacity="0.5" stop-color="rgba(162,147,208,0.5)" offset="1"></stop>
                <stop id="SvgjsStop1823" stop-opacity="0.5" stop-color="rgba(162,147,208,0.5)" offset="1"></stop>
              </linearGradient>
            </defs>
            <g id="SvgjsG1826" className="apexcharts-grid">
              {/* Helper lines */}
              {/* <g id="SvgjsG1827" className="apexcharts-gridlines-horizontal" style={{}}>
                <line id="SvgjsLine1830" x1="0" y1="0" x2="531" y2="0" stroke="#e0e0e0" stroke-dasharray="0" stroke-linecap="butt" className="apexcharts-gridline"></line>
                <line id="SvgjsLine1831" x1="0" y1="19" x2="531" y2="19" stroke="#e0e0e0" stroke-dasharray="0" stroke-linecap="butt" className="apexcharts-gridline"></line>
                <line id="SvgjsLine1832" x1="0" y1="38" x2="531" y2="38" stroke="#e0e0e0" stroke-dasharray="0" stroke-linecap="butt" className="apexcharts-gridline"></line>
                <line id="SvgjsLine1833" x1="0" y1="57" x2="531" y2="57" stroke="#e0e0e0" stroke-dasharray="0" stroke-linecap="butt" className="apexcharts-gridline"></line>
                <line id="SvgjsLine1834" x1="0" y1="76" x2="531" y2="76" stroke="#e0e0e0" stroke-dasharray="0" stroke-linecap="butt" className="apexcharts-gridline"></line>
                <line id="SvgjsLine1835" x1="0" y1="95" x2="531" y2="95" stroke="#e0e0e0" stroke-dasharray="0" stroke-linecap="butt" className="apexcharts-gridline"></line>
              </g> */}
              <g id="SvgjsG1828" className="apexcharts-gridlines-vertical" style={{ display: 'none' }}></g>
              <line id="SvgjsLine1837" x1="0" y1="95" x2="531" y2="95" stroke="transparent" stroke-dasharray="0" stroke-linecap="butt"></line>
              <line id="SvgjsLine1836" x1="0" y1="1" x2="0" y2="95" stroke="transparent" stroke-dasharray="0" stroke-linecap="butt"></line>
            </g>
            <g id="SvgjsG1816" className="apexcharts-area-series apexcharts-plot-series"><g id="SvgjsG1817" className="apexcharts-series">
              <path id="SvgjsPath1824" d="M 0 95 L 0 95C 30.974999999999998 95 57.525000000000006 66.5 88.5 66.5C 119.475 66.5 146.025 76 177 76C 207.975 76 234.525 0 265.5 0C 296.475 0 323.025 38 354 38C 384.975 38 411.525 19 442.5 19C 473.475 19 500.025 47.5 531 47.5C 531 47.5 531 47.5 531 95M 531 47.5z" fill="url(#SvgjsLinearGradient1820)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="0" stroke-dasharray="0" className="apexcharts-area" clip-path="url(#gridRectMaskf22gi0fs)" path="M 0 95 L 0 95C 30.974999999999998 95 57.525000000000006 66.5 88.5 66.5C 119.475 66.5 146.025 76 177 76C 207.975 76 234.525 0 265.5 0C 296.475 0 323.025 38 354 38C 384.975 38 411.525 19 442.5 19C 473.475 19 500.025 47.5 531 47.5C 531 47.5 531 47.5 531 95M 531 47.5z" ></path>
              <path id="SvgjsPath1825" d="M 0 95C 30.974999999999998 95 57.525000000000006 66.5 88.5 66.5C 119.475 66.5 146.025 76 177 76C 207.975 76 234.525 0 265.5 0C 296.475 0 323.025 38 354 38C 384.975 38 411.525 19 442.5 19C 473.475 19 500.025 47.5 531 47.5" fill="none" fill-opacity="1" stroke="#4527a0" stroke-opacity="1" stroke-linecap="butt" stroke-width="1" stroke-dasharray="0" className="apexcharts-area" clip-path="url(#gridRectMaskf22gi0fs)" path="M 0 95C 30.974999999999998 95 57.525000000000006 66.5 88.5 66.5C 119.475 66.5 146.025 76 177 76C 207.975 76 234.525 0 265.5 0C 296.475 0 323.025 38 354 38C 384.975 38 411.525 19 442.5 19C 473.475 19 500.025 47.5 531 47.5" fill-rule="evenodd"></path>
              <g id="SvgjsG1818" className="apexcharts-series-markers-wrap">
                <g className="apexcharts-series-markers"><circle id="SvgjsCircle1853" r="0" cx="265.5" cy="0" className="apexcharts-marker wv69qqmnq no-pointer-events" stroke="#ffffff" fill="#4527a0" fill-opacity="1" stroke-width="2" stroke-opacity="0.9" default-marker-size="0"></circle></g></g></g>
              <g id="SvgjsG1819" className="apexcharts-datalabels"></g>
            </g>
            <g id="SvgjsG1829" className="apexcharts-grid-borders" style={{ display: 'none' }}></g>
            <line id="SvgjsLine1838" x1="0" y1="0" x2="531" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" className="apexcharts-ycrosshairs"></line>
            <line id="SvgjsLine1839" x1="0" y1="0" x2="531" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" className="apexcharts-ycrosshairs-hidden"></line>
            <g id="SvgjsG1840" className="apexcharts-xaxis" transform="translate(0, 0)">
              <g id="SvgjsG1841" className="apexcharts-xaxis-texts-g" transform="translate(0, -4)"></g>
            </g>
          </g>
        </svg>
        <Table rows={optimizedBasespots} settings={{
          select: true,
          pagination: {
            enabled: true,
            rowsPerPage: 10,
            pageSizeOptions: [10, 25, 50, 100],
          },
        }} columns={[{
          header: "Name",
          field: "name",
          sortable: true,
        }, {
          header: "Description",
          field: "description",
          sortable: true,
        }, {
          header: "Map",
          field: "Map.name",
          sortable: true,
        }, {
          header: "Last Updated",
          field: "updated_at",
          render: ({ value }) => (
            <span className="rw-badge rw-badge-gray-outline">
              <svg className="w-2.5 h-2.5 mr-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
              </svg>
              {relativeDate(new Date(value), 'days')}
            </span>
          )
        }, {
          header: "Progress",
          field: "progress",
          render: ({ value, row }) => {
            let color = 'bg-red-500'
            switch (true) {
              case (value <= 20):
                color = "bg-red-500";
              case (value <= 40 && value > 20):
                color = "bg-orange-500";
              case (value > 40 && value <= 60):
                color = "bg-yellow-500";
              case (value > 60 && value <= 80):
                color = "bg-lime-500";
              case (value <= 100 && value > 80):
                color = "bg-green-500";
            }

            return (
              <dd className="flex items-center space-x-2" title={row.missingSteps}>
                <div className="w-full bg-gray-200 rounded h-2 dark:bg-gray-700">
                  <div className={`h-2 rounded ${color}`} style={{ width: `${value}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{value}%</span>
              </dd>
            )
          }
        }]} />
      </div >
      {/* <div className="flex items-center mb-5">
            <p className="bg-blue-100 text-blue-800 text-sm font-semibold inline-flex items-center p-1.5 rounded dark:bg-blue-200 dark:text-blue-800">8.7</p>
            <p className="ml-2 font-medium text-gray-900 dark:text-white">Excellent</p>
            <span className="w-1 h-1 mx-2 bg-gray-900 rounded-full dark:bg-gray-500"></span>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">376 reviews</p>
            <a href="#" className="ml-auto text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Read all reviews</a>
          </div>
          <div className="gap-8 sm:grid sm:grid-cols-2">
            <div>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Staff</dt>
                <dd className="flex items-center mb-3">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{ width: '88%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">8.8</span>
                </dd>
              </dl>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Comfort</dt>
                <dd className="flex items-center mb-3">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{ width: '89%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">8.9</span>
                </dd>
              </dl>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Free WiFi</dt>
                <dd className="flex items-center mb-3">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{ width: '88%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">8.8</span>
                </dd>
              </dl>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Facilities</dt>
                <dd className="flex items-center">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{ width: '54%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">5.4</span>
                </dd>
              </dl>
            </div>
            <div>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Value for money</dt>
                <dd className="flex items-center mb-3">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{ width: '89%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">8.9</span>
                </dd>
              </dl>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Cleanliness</dt>
                <dd className="flex items-center mb-3">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">7.0</span>
                </dd>
              </dl>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
                <dd className="flex items-center">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{ width: '89%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">8.9</span>
                </dd>
              </dl>
            </div>
          </div> */}
    </>
  )
}

export default Admin
