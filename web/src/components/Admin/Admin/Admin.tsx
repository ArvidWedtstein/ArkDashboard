import { MetaTags } from "@redwoodjs/web"
import clsx from "clsx"
import { PingAlert } from "src/components/Util/PingAlert/PingAlert"
import StatCard from "src/components/Util/StatCard/StatCard"
import Table from "src/components/Util/Table/Table"
import { FindAdminData } from "types/graphql"

const Admin = ({ basespots }: FindAdminData) => {
  return (
    <>
      <MetaTags title="Admin" description="Admin page" />

      {/* TODO: Replace with taybul?*/}
      <div className="container-xl overflow-hidden p-3 text-center m-4">
        <div className="flex flex-col-reverse md:flex-row space-x-3 mb-3">
          <StatCard stat={"Test"} value={10} />
          <StatCard stat={"Test"} value={10} />
          <StatCard stat={"Test"} value={10} />
          <StatCard stat={"Test"} value={10} />
        </div>
        <Table className="" settings={{
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
          header: "Progress",
          field: "id",
          render: ({ row }) => {
            const totalSteps = 5;
            const colors = [
              "bg-red-500",
              "bg-orange-500",
              "bg-yellow-500",
              "bg-lime-500",
              "bg-green-500",
            ];

            let completedSteps = 0;
            if (row.description && row.description.length < 70) {
              completedSteps += 0.5;
            }
            if (row.description && row.description.length >= 70) {
              completedSteps += 1
            }

            if (row.image) {
              completedSteps += 1
            }

            if (row.estimated_for_players) {
              completedSteps += 1
            }

            if (row.turret_setup_images && row.turret_setup_images.length > 0) {
              completedSteps += 1
            }

            if (row.type) {
              completedSteps += 1
            }

            const completionPercentage = (completedSteps / totalSteps) * 100;


            const color = (completionPercentage) => {
              switch (true) {
                case (completionPercentage <= 20):
                  return "bg-red-500";
                case (completionPercentage <= 40 && completionPercentage > 20):
                  return "bg-orange-500";
                case (completionPercentage > 40 && completionPercentage <= 60):
                  return "bg-yellow-500";
                case (completionPercentage > 60 && completionPercentage <= 80):
                  return "bg-lime-500";
                case (completionPercentage <= 100 && completionPercentage > 80):
                  return "bg-green-500";
              }
            }
            const getBarColor = (index) => {
              return Math.round(completedSteps) >= index + 1
                ? colors[index]
                : "bg-transparent";
            };

            return (
              <>
                <dd className="flex items-center space-x-2">
                  <div className="w-full bg-gray-200 rounded h-2 dark:bg-gray-700">
                    <div className={`h-2 rounded ${color(completionPercentage)}`} style={{ width: `${completionPercentage}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{completionPercentage}%</span>
                </dd>
                {/* <div
                  className="flex h-2 w-32 flex-row rounded-full bg-gray-300 dark:bg-gray-700"
                >
                  {Array.from(Array(totalSteps)).map((_, i) => (
                    <div
                      key={`${row.row_id}-progess-${i}`}
                      className={clsx(
                        `h-full w-1/5`,
                        "first:rounded-l-full last:rounded-r-full",
                        getBarColor(i)
                      )}
                    ></div>
                  ))}
                </div> */}
              </>
            )
          }
        }]} rows={basespots} />
        {/* Object.keys(basespots[0]).map((f) => {
          if (f !== "__typename" && f !== "Map") {
            return {
              label: f,
              field: f,
            }
          }
          return null
        }).filter((f) => f != null) */}
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
