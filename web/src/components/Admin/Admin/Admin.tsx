import { MetaTags } from "@redwoodjs/web"
import { useEffect, useMemo, useRef } from "react"
import Chart from "src/components/Util/Chart/Chart"
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

        {/* <Chart data={[65, 59, 67, 70, 56, 55]} labels={['January', 'February', 'March', 'April', 'May', 'June']} /> */}

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
