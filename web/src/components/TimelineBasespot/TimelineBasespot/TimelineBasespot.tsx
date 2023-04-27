import { useAuth } from "@redwoodjs/auth";
import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { supabase } from "src/App";
import { Map } from "src/components/Util/Map/Map";
import { Modal, RefModal } from "src/components/Util/Modal/Modal";

import { getDateDiff, nmbFormat, timeTag, truncate } from "src/lib/formatters";

import type {
  DeleteTimelineBasespotMutationVariables,
  FindTimelineBasespotById,
} from "types/graphql";

const DELETE_TIMELINE_BASESPOT_MUTATION = gql`
  mutation DeleteTimelineBasespotMutation($id: BigInt!) {
    deleteTimelineBasespot(id: $id) {
      id
    }
  }
`;

const RAID_TIMELINE_BASESPOT_MUTATION = gql`
  mutation RaidTimelineBasespotMutation(
    $id: BigInt!
    $input: RaidTimelineBasespotInput!
  ) {
    raidTimelineBasespot(id: $id, input: $input) {
      id
      end_date
      raid_comment
      raided_by
    }
  }
`;

interface Props {
  timelineBasespot: NonNullable<FindTimelineBasespotById["timelineBasespot"]>;
}

const TimelineBasespot = ({ timelineBasespot }: Props) => {
  const { isAuthenticated, currentUser } = useAuth();
  const [deleteTimelineBasespot] = useMutation(
    DELETE_TIMELINE_BASESPOT_MUTATION,
    {
      onCompleted: () => {
        toast.success("TimelineBasespot deleted");
        navigate(routes.timelineBasespots());
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
  const [raidTimelineBasespot] = useMutation(RAID_TIMELINE_BASESPOT_MUTATION, {
    onCompleted: () => {
      toast.success("TimelineBasespot raid initiated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteTimelineBasespotMutationVariables["id"]) => {
    if (
      confirm("Are you sure you want to delete timelineBasespot " + id + "?")
    ) {
      deleteTimelineBasespot({ variables: { id } });
    }
  };
  const [isRaided, setIsRaided] = useState(false);
  const initRaid = () => {
    if (confirm("Are you sure you are being raided?")) {
      setIsRaided(true);
      setIsComponentVisible(false);
    }
  };
  const [images, setImages] = useState([]);
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const [currentModalImage, setCurrentModalImage] = useState(null);
  useEffect(() => {
    supabase.storage
      .from("timelineimages")
      .list(timelineBasespot.id.toString())
      .then(({ data, error }) => {
        if (error) throw error;
        if (data) {
          setImages(data);
        }
      });
  }, []);

  return (
    <article className="rw-segment">
      <RefModal
        isOpen={isComponentVisible}
        onClose={() => setIsComponentVisible(false)}
        setIsOpen={(open) => setIsComponentVisible(open)}
        image={currentModalImage}
      />
      <div className="w-full p-2 lg:w-2/3">
        <div className="bg-card h-60 rounded-lg sm:h-80">
          <div className="flex h-full flex-col p-4">
            <div className="">
              <div className="flex items-center">
                <div className="font-bold text-white">Your Work Summary</div>
                <div className="flex-grow"></div>
                <img
                  src="https://assets.codepen.io/3685267/res-react-dash-graph-range.svg"
                  alt=""
                  className="h-4 w-4"
                />
                <div className="ml-2">Last 9 Months</div>
                <div className="icon-background ml-6 flex h-5 w-5 items-center justify-center rounded-full">
                  ?
                </div>
              </div>
              <div className="ml-5 font-bold">Nov - July</div>
            </div>
            <div className="flex-grow">
              <div className="recharts-responsive-container h-full w-full">
                <div className="recharts-wrapper relative h-[240px] w-[639px]">
                  <svg
                    className="recharts-surface"
                    width="639"
                    height="240"
                    viewBox="0 0 639 240"
                    version="1.1"
                  >
                    <defs>
                      <clipPath id="recharts3-clip">
                        <rect x="65" y="5" height="200" width="569"></rect>
                      </clipPath>
                    </defs>
                    <defs>
                      <linearGradient
                        id="paint0_linear"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop stop-color="#6B8DE3"></stop>
                        <stop offset="1" stop-color="#7D1C8D"></stop>
                      </linearGradient>
                    </defs>
                    <g className="recharts-cartesian-grid">
                      <g className="recharts-cartesian-grid-vertical">
                        <line
                          stroke-width="6"
                          stroke="#252525"
                          fill="none"
                          x="65"
                          y="5"
                          width="569"
                          height="200"
                          x1="65"
                          y1="5"
                          x2="65"
                          y2="205"
                        ></line>
                        <line
                          stroke-width="6"
                          stroke="#252525"
                          fill="none"
                          x="65"
                          y="5"
                          width="569"
                          height="200"
                          x1="136.125"
                          y1="5"
                          x2="136.125"
                          y2="205"
                        ></line>
                        <line
                          stroke-width="6"
                          stroke="#252525"
                          fill="none"
                          x="65"
                          y="5"
                          width="569"
                          height="200"
                          x1="207.25"
                          y1="5"
                          x2="207.25"
                          y2="205"
                        ></line>
                        <line
                          stroke-width="6"
                          stroke="#252525"
                          fill="none"
                          x="65"
                          y="5"
                          width="569"
                          height="200"
                          x1="278.375"
                          y1="5"
                          x2="278.375"
                          y2="205"
                        ></line>
                        <line
                          stroke-width="6"
                          stroke="#252525"
                          fill="none"
                          x="65"
                          y="5"
                          width="569"
                          height="200"
                          x1="349.5"
                          y1="5"
                          x2="349.5"
                          y2="205"
                        ></line>
                        <line
                          stroke-width="6"
                          stroke="#252525"
                          fill="none"
                          x="65"
                          y="5"
                          width="569"
                          height="200"
                          x1="420.625"
                          y1="5"
                          x2="420.625"
                          y2="205"
                        ></line>
                        <line
                          stroke-width="6"
                          stroke="#252525"
                          fill="none"
                          x="65"
                          y="5"
                          width="569"
                          height="200"
                          x1="491.75"
                          y1="5"
                          x2="491.75"
                          y2="205"
                        ></line>
                        <line
                          stroke-width="6"
                          stroke="#252525"
                          fill="none"
                          x="65"
                          y="5"
                          width="569"
                          height="200"
                          x1="562.875"
                          y1="5"
                          x2="562.875"
                          y2="205"
                        ></line>
                        <line
                          stroke-width="6"
                          stroke="#252525"
                          fill="none"
                          x="65"
                          y="5"
                          width="569"
                          height="200"
                          x1="634"
                          y1="5"
                          x2="634"
                          y2="205"
                        ></line>
                      </g>
                    </g>
                    <g className="recharts-layer recharts-cartesian-axis recharts-xAxis xAxis">
                      <g className="recharts-cartesian-axis-ticks">
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <text
                            width="569"
                            height="30"
                            x="65"
                            y="221"
                            stroke="none"
                            fill="#666"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                          >
                            <tspan x="65" dy="0.71em">
                              Nov
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <text
                            width="569"
                            height="30"
                            x="136.125"
                            y="221"
                            stroke="none"
                            fill="#666"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                          >
                            <tspan x="136.125" dy="0.71em">
                              Dec
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <text
                            width="569"
                            height="30"
                            x="207.25"
                            y="221"
                            stroke="none"
                            fill="#666"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                          >
                            <tspan x="207.25" dy="0.71em">
                              Jan
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <text
                            width="569"
                            height="30"
                            x="278.375"
                            y="221"
                            stroke="none"
                            fill="#666"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                          >
                            <tspan x="278.375" dy="0.71em">
                              Feb
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <text
                            width="569"
                            height="30"
                            x="349.5"
                            y="221"
                            stroke="none"
                            fill="#666"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                          >
                            <tspan x="349.5" dy="0.71em">
                              Mar
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <text
                            width="569"
                            height="30"
                            x="420.625"
                            y="221"
                            stroke="none"
                            fill="#666"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                          >
                            <tspan x="420.625" dy="0.71em">
                              Apr
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <text
                            width="569"
                            height="30"
                            x="491.75"
                            y="221"
                            stroke="none"
                            fill="#666"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                          >
                            <tspan x="491.75" dy="0.71em">
                              May
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <text
                            width="569"
                            height="30"
                            x="562.875"
                            y="221"
                            stroke="none"
                            fill="#666"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                          >
                            <tspan x="562.875" dy="0.71em">
                              June
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <text
                            width="569"
                            height="30"
                            x="624.7734375"
                            y="221"
                            stroke="none"
                            fill="#666"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                          >
                            <tspan x="624.7734375" dy="0.71em">
                              July
                            </tspan>
                          </text>
                        </g>
                      </g>
                    </g>
                    <g className="recharts-layer recharts-cartesian-axis recharts-yAxis yAxis">
                      <g className="recharts-cartesian-axis-ticks">
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <text
                            width="60"
                            height="200"
                            x="49"
                            y="205"
                            stroke="none"
                            fill="#666"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="end"
                          >
                            <tspan x="49" dy="0.355em">
                              0
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <text
                            width="60"
                            height="200"
                            x="49"
                            y="155"
                            stroke="none"
                            fill="#666"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="end"
                          >
                            <tspan x="49" dy="0.355em">
                              650
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <text
                            width="60"
                            height="200"
                            x="49"
                            y="105"
                            stroke="none"
                            fill="#666"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="end"
                          >
                            <tspan x="49" dy="0.355em">
                              1300
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <text
                            width="60"
                            height="200"
                            x="49"
                            y="55"
                            stroke="none"
                            fill="#666"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="end"
                          >
                            <tspan x="49" dy="0.355em">
                              1950
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <text
                            width="60"
                            height="200"
                            x="49"
                            y="12"
                            stroke="none"
                            fill="#666"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="end"
                          >
                            <tspan x="49" dy="0.355em">
                              2600
                            </tspan>
                          </text>
                        </g>
                      </g>
                    </g>
                    <g className="recharts-layer recharts-line">
                      <path
                        stroke="#242424"
                        stroke-width="3"
                        stroke-dasharray="8 8"
                        fill="none"
                        width="569"
                        height="200"
                        className="recharts-curve recharts-line-curve"
                        d="M65,48.36191760214189C88.70833333333333,64.50728197077581,112.41666666666667,80.65264633940971,136.125,80.65264633940971C159.83333333333334,80.65264633940971,183.54166666666666,11.297235679305459,207.25,11.297235679305459C230.95833333333334,11.297235679305459,254.66666666666666,60.69777480461221,278.375,84.9175159405845C302.0833333333333,109.13725707655678,325.7916666666667,156.6156824951392,349.5,156.6156824951392C373.2083333333333,156.6156824951392,396.9166666666667,67.42182793472833,420.625,67.42182793472833C444.3333333333333,67.42182793472833,468.0416666666667,183.84815615562746,491.75,183.84815615562746C515.4583333333334,183.84815615562746,539.1666666666666,84.87472003976761,562.875,84.87472003976761C586.5833333333334,84.87472003976761,610.2916666666666,121.45069886187211,634,158.0266776839766"
                      ></path>
                    </g>
                    <g className="recharts-layer recharts-line">
                      <path
                        stroke="url(#paint0_linear)"
                        stroke-width="4"
                        fill="none"
                        width="569"
                        height="200"
                        className="recharts-curve recharts-line-curve"
                        d="M65,48.787215407603554C88.70833333333333,52.08354278566151,112.41666666666667,55.37987016371946,136.125,55.37987016371946C159.83333333333334,55.37987016371946,183.54166666666666,55.31375355528897,207.25,55.31375355528897C230.95833333333334,55.31375355528897,254.66666666666666,63.1456317307987,278.375,78.80938808181816C302.0833333333333,94.47314443283761,325.7916666666667,159.37017169008817,349.5,159.37017169008817C373.2083333333333,159.37017169008817,396.9166666666667,99.76602814025466,420.625,99.76602814025466C444.3333333333333,99.76602814025466,468.0416666666667,129.98249279188164,491.75,129.98249279188164C515.4583333333334,129.98249279188164,539.1666666666666,23.2724149434207,562.875,23.2724149434207C586.5833333333334,23.2724149434207,610.2916666666666,53.6005700527309,634,83.9287251620411"
                      ></path>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isRaided}
        onClose={() => setIsRaided(false)}
        form={
          <div className="flex flex-col items-center justify-center text-gray-700 dark:text-white">
            <h1 className="text-2xl font-bold">You are being raided!</h1>
            <p className="text-lg">
              Please fill out the form below to report the raid.
            </p>
            <label className="rw-label">Raided By</label>
            <input className="rw-input" type="text" name="raided_by" />

            <label className="rw-label">Raid Comment</label>
            <textarea className="rw-input" name="raid_comment" />

            <label className="rw-label">Raid Comment</label>
            <input type="datetime-local" className="rw-input" name="end_date" />
          </div>
        }
        formSubmit={(data) => {
          data.preventDefault();
          const formData = new FormData(data.currentTarget);
          raidTimelineBasespot({
            variables: {
              id: timelineBasespot.id,
              input: {
                end_date: formData.get("end_date") || new Date(),
                raid_comment: formData.get("raid_comment"),
                raided_by: formData.get("raided_by"),
              },
            },
          });
          setIsRaided(false);
        }}
      />

      <div className="m-2 block rounded-md text-white">
        <section className="body-font">
          <div className="container mx-auto flex flex-col items-center px-5 py-12 md:flex-row">
            <div className="mb-16 flex flex-col items-center text-center md:mb-0 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
              <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 dark:text-zinc-200 sm:text-4xl">
                {timelineBasespot.tribe_name}
              </h1>
              <p className="leading-relaxed">
                This time we played on{" "}
                {timelineBasespot.server && timelineBasespot.server}
                {timelineBasespot.cluster &&
                  `, ${timelineBasespot.cluster}`}{" "}
                {timelineBasespot.season &&
                  `, Season ${timelineBasespot.season}`}
              </p>
              <div className="mt-2 flex justify-center space-x-2">
                <Link
                  to={routes.editTimelineBasespot({
                    id: timelineBasespot.id.toString(),
                  })}
                  className="rw-button rw-button-gray-outline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDeleteClick(timelineBasespot.id)}
                  className="rw-button rw-button-red-outline"
                >
                  Delete
                </button>
              </div>
            </div>
            {images.length > 0 && (
              <div className="w-5/6 md:w-1/2 lg:w-full lg:max-w-lg">
                <img
                  className="rounded-lg object-cover object-center"
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineBasespot.id}/${images[0].name}`}
                  alt={timelineBasespot.tribe_name}
                />
              </div>
            )}
          </div>
        </section>
        <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-gray-200 dark:text-neutral-200">
          <div className="container mx-auto flex flex-wrap px-5 py-12">
            <div className="mb-10 w-full overflow-hidden text-sm lg:mb-0 lg:w-1/2">
              <p>
                We started playing on {timeTag(timelineBasespot.start_date)}.
              </p>
              <p>
                {!timelineBasespot.end_date && !timelineBasespot.raided_by
                  ? ""
                  : `Got raided `}
                {timelineBasespot.end_date && `on `}
                {timeTag(timelineBasespot.end_date)}
                {timelineBasespot.raided_by &&
                  `by ${timelineBasespot.raided_by}.`}
              </p>
              {timelineBasespot.start_date && timelineBasespot.end_date && (
                <p>
                  Base lasted{" "}
                  {
                    getDateDiff(
                      new Date(timelineBasespot.start_date),
                      new Date(timelineBasespot.end_date)
                    ).dateString
                  }
                </p>
              )}
            </div>
          </div>
        </section>
        {timelineBasespot.raid_comment && timelineBasespot.raided_by && (
          <section className="body-font mx-4 border-t border-gray-700 text-stone-300 dark:border-gray-200">
            <div className="container mx-auto px-5 py-24">
              <div className="mx-auto w-full text-center lg:w-3/4 xl:w-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="mb-8 inline-block h-8 w-8 text-white"
                  viewBox="0 0 975.036 975.036"
                >
                  <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                </svg>
                <p className="text-lg leading-relaxed">
                  {timelineBasespot.raid_comment}
                </p>
                <span className="mt-8 mb-6 inline-block h-1 w-10 rounded bg-indigo-500"></span>
                <h2 className="title-font text-sm font-medium tracking-wider text-stone-400">
                  {timelineBasespot.raided_by}
                </h2>
                <p className="text-gray-500">{timelineBasespot.cluster}</p>
              </div>
            </div>
          </section>
        )}
        <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-gray-200 dark:text-neutral-200">
          <div className="container mx-auto flex flex-wrap px-5 py-12">
            <div className="mb-10 w-full overflow-hidden rounded-lg lg:mb-0 lg:w-1/2">
              <Map
                className="h-full w-full object-cover object-center"
                map={timelineBasespot.map.toString()}
                size={{ width: 500, height: 500 }}
                pos={[
                  {
                    lat: timelineBasespot.latitude,
                    lon: timelineBasespot.longitude,
                  } as any,
                ]}
                interactive={true}
              />
              {/* <Map
                className="h-full w-full object-cover object-center"
                map={timelineBasespot.map.toString()}
                size={{ width: 500, height: 500 }}
                pos={[timelineBasespot.location as any]}
                interactive={true}
              /> */}
            </div>
            <div className="-mb-10 flex flex-col flex-wrap text-center lg:w-1/2 lg:py-6 lg:pl-12 lg:text-left">
              <div className="mb-10 flex flex-col items-center lg:items-start">
                <div className="bg-pea-50 text-pea-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div className="flex-grow">
                  <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-neutral-200">
                    Coordinates
                  </h2>
                  <p className="text-base leading-relaxed">
                    Our base was located at: {timelineBasespot.latitude}{" "}
                    <abbr title="Latitude">Lat</abbr>,{" "}
                    {timelineBasespot.longitude}{" "}
                    <abbr title="Longitude">Lon</abbr>
                  </p>
                </div>
              </div>
              {timelineBasespot.basespot && (
                <div className="mb-10 flex flex-col items-center lg:items-start">
                  <div className="bg-pea-50 text-pea-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="fill-pea-500 h-6 w-6"
                    >
                      <path d="M560.02 32c-1.96 0-3.98.37-5.96 1.16L384.01 96H384L212 35.28A64.252 64.252 0 0 0 191.76 32c-6.69 0-13.37 1.05-19.81 3.14L20.12 87.95A32.006 32.006 0 0 0 0 117.66v346.32C0 473.17 7.53 480 15.99 480c1.96 0 3.97-.37 5.96-1.16L192 416l172 60.71a63.98 63.98 0 0 0 40.05.15l151.83-52.81A31.996 31.996 0 0 0 576 394.34V48.02c0-9.19-7.53-16.02-15.98-16.02zM224 90.42l128 45.19v285.97l-128-45.19V90.42zM48 418.05V129.07l128-44.53v286.2l-.64.23L48 418.05zm480-35.13l-128 44.53V141.26l.64-.24L528 93.95v288.97z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-neutral-200">
                      Base
                    </h2>
                    <p className="text-base leading-relaxed">
                      Our basespot was {timelineBasespot.basespot.name}
                    </p>
                  </div>
                </div>
              )}
              <div className="mb-10 flex flex-col items-center lg:items-start">
                <div className="bg-pea-50 text-pea-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="flex-grow">
                  <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-neutral-200">
                    Players
                  </h2>
                  <p className="text-base leading-relaxed">
                    This time{" "}
                    {timelineBasespot.players.length < 3
                      ? timelineBasespot.players.join(" and ")
                      : timelineBasespot.players.join(", ")}{" "}
                    played
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-gray-200 dark:text-neutral-200">
          <div className="container mx-auto px-5 py-24">
            <div className="mb-20 flex w-full flex-col text-center">
              <h2 className="title-font text-pea-500 mb-1 text-xs font-medium tracking-widest">
                Images & Screenshots taken during this season
              </h2>
              <h1 className="title-font text-2xl font-medium text-gray-900 dark:text-neutral-200 sm:text-3xl">
                Images
              </h1>
            </div>
            <div className="-m-4 flex flex-wrap">
              {images.map((img, i) => (
                <div key={`img${i}`} className="p-4 md:w-1/3">
                  <div className="flex h-full flex-col rounded-lg bg-gray-100 p-0 dark:bg-gray-600">
                    <div className="m-3 mb-3 flex items-center">
                      <div className="bg-pea-500 mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          strokeWidth={2}
                          className="m-1 h-5 w-5 fill-current"
                        >
                          <path d="M464 96h-88l-12.38-32.88C356.6 44.38 338.8 32 318.8 32h-125.5c-20 0-38 12.38-45 31.12L136 96H48C21.5 96 0 117.5 0 144v288C0 458.5 21.5 480 48 480h416c26.5 0 48-21.5 48-48v-288C512 117.5 490.5 96 464 96zM496 432c0 17.64-14.36 32-32 32h-416c-17.64 0-32-14.36-32-32v-288c0-17.64 14.36-32 32-32h99.11l16.12-43.28C167.9 56.33 179.9 48 193.3 48h125.5c13.25 0 25.26 8.326 29.9 20.76L364.9 112H464c17.64 0 32 14.36 32 32V432zM256 176C194.2 176 144 226.2 144 288c0 61.76 50.24 112 112 112s112-50.24 112-112C368 226.2 317.8 176 256 176zM256 384c-53 0-96-43-96-96s43-96 96-96s96 43 96 96S309 384 256 384z" />
                        </svg>
                      </div>
                      <h2 className="title-font text-lg font-medium text-gray-900 dark:text-neutral-200">
                        {timeTag(img.created_at)}
                      </h2>
                    </div>
                    <div className="flex-grow">
                      <p className="text-base leading-relaxed"></p>
                      <img
                        onClick={() => {
                          setCurrentModalImage(
                            `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineBasespot.id}/${img.name}`
                          );
                          setIsComponentVisible(true);
                          setIsRaided(false);
                        }}
                        className="h-full w-full cursor-pointer rounded-b object-cover object-center"
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineBasespot.id}/${img.name}`}
                        alt={timelineBasespot.id.toString()}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {isAuthenticated &&
          !timelineBasespot.end_date &&
          !timelineBasespot.raided_by &&
          !timelineBasespot.raid_comment && (
            <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-gray-200 dark:text-neutral-200">
              <button
                className="rw-button rw-button-red-outline rw-button-large m-3"
                onClick={() => initRaid()}
              >
                Raid
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  className="fill-current"
                >
                  <path d="M285.3 247.1c-3.093-4.635-8.161-7.134-13.32-7.134c-8.739 0-15.1 7.108-15.1 16.03c0 3.05 .8717 6.133 2.693 8.859l52.37 78.56l-76.12 25.38c-6.415 2.16-10.94 8.159-10.94 15.18c0 2.758 .7104 5.498 2.109 7.946l63.1 112C293.1 509.1 298.5 512 304 512c11.25 0 15.99-9.84 15.99-16.02c0-2.691-.6807-5.416-2.114-7.915L263.6 393l77.48-25.81c1.701-.5727 10.93-4.426 10.93-15.19c0-3.121-.9093-6.205-2.685-8.873L285.3 247.1zM575.1 256c0-4.435-1.831-8.841-5.423-12l-58.6-51.87c.002-.0938 0 .0938 0 0l.0247-144.1c0-8.844-7.156-16-15.1-16L400 32c-8.844 0-15.1 7.156-15.1 16l-.0014 31.37L298.6 4c-3.016-2.656-6.797-3.997-10.58-3.997c-3.781 0-7.563 1.34-10.58 3.997l-271.1 240C1.831 247.2 .0007 251.6 .0007 256c0 8.92 7.239 15.99 16.04 15.99c3.757 0 7.52-1.313 10.54-3.993l37.42-33.02V432c0 44.13 35.89 80 79.1 80h63.1c8.844 0 15.1-7.156 15.1-16S216.8 480 208 480h-63.1c-26.47 0-47.1-21.53-47.1-48v-224c0-.377-.1895-.6914-.2148-1.062L288 37.34l192.2 169.6C480.2 207.3 479.1 207.6 479.1 208v224c0 26.47-21.53 48-47.1 48h-31.1c-8.844 0-15.1 7.156-15.1 16s7.156 16 15.1 16h31.1c44.11 0 79.1-35.88 79.1-80V234.1L549.4 268C552.5 270.7 556.2 272 559.1 272C568.7 272 575.1 264.9 575.1 256zM479.1 164.1l-63.1-56.47V64h63.1V164.1z" />
                </svg>
              </button>
            </section>
          )}

        {timelineBasespot.TimelineBasespotDino.length > 0 && (
          <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-gray-200 dark:text-neutral-200">
            <div className="container mx-auto px-5 py-24">
              <div className="mb-20 flex w-full flex-col text-center">
                <h2 className="title-font  text-pea-500 mb-1 text-xs font-medium tracking-widest">
                  Dinos we had during this base
                </h2>
                <h1 className="title-font text-2xl font-medium text-gray-900 dark:text-neutral-200 sm:text-3xl">
                  Dinos
                </h1>
              </div>
              <div className="-m-4 flex flex-wrap">
                {timelineBasespot.TimelineBasespotDino.map((dino, i) => (
                  <div
                    className="w-1/3 max-w-3xl p-2"
                    key={`timelinebasespotdino-${i}`}
                  >
                    <div className="border border-[#97FBFF] bg-[#0D2836] p-4">
                      <div className="flex flex-row space-x-3">
                        <div className="h-28 w-28 overflow-hidden border border-[#97FBFF]">
                          <img
                            style={{
                              filter:
                                "invert(95%) sepia(69%) saturate(911%) hue-rotate(157deg) brightness(100%) contrast(103%)",
                            }}
                            className="h-full w-full object-cover object-center p-2"
                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${dino.Dino.icon}`}
                            alt=""
                          />
                        </div>
                        <div className="flex flex-col items-start justify-start leading-snug">
                          <h1 className="mb-2 text-2xl font-semibold uppercase text-white">
                            {truncate(dino.name, 13)} {dino.level}
                          </h1>
                          <p
                            className={clsx({
                              "text-blue-500": dino.gender === "Male",
                              "text-pink-500": dino.gender === "Female",
                              "text-white": dino.gender === "N/A",
                            })}
                          >
                            {dino.gender}
                          </p>
                          <p
                            className="font-semibold text-green-500"
                            title={dino.death_cause}
                          >
                            {timelineBasespot.tribe_name}
                            {/* {timeTag(dino.birth_date)} - {timeTag(dino.death_date)} */}
                          </p>
                          <p className="font-semibold text-green-500">
                            Tamed ({dino.level_wild})
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-4 place-content-center gap-1 text-center font-medium">
                        <p className="inline-flex space-x-2">
                          <img
                            className="h-6 w-6"
                            src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/8/8d/Stamina.png"
                            alt=""
                          />
                          <span>
                            {nmbFormat(
                              dino.wild_stamina *
                                dino.Dino.base_stats["s"]["w"] +
                                dino.stamina * dino.Dino.base_stats["s"]["t"] +
                                dino.Dino.base_stats["s"]["b"]
                            )}
                          </span>
                        </p>
                        <p className="text-center">
                          ({dino.wild_stamina}-{dino.stamina})
                        </p>
                        <p className="inline-flex space-x-2">
                          <img
                            className="h-6 w-6"
                            src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/6/6f/Weight.png"
                            alt=""
                          />
                          <span>
                            {nmbFormat(
                              dino.wild_weight *
                                dino.Dino.base_stats["w"]["w"] +
                                dino.weight * dino.Dino.base_stats["w"]["t"] +
                                dino.Dino.base_stats["w"]["b"]
                            )}
                          </span>
                        </p>
                        <p className="text-center">
                          ({dino.wild_weight}-{dino.weight})
                        </p>
                        <p className="inline-flex space-x-2">
                          <img
                            className="h-6 w-6"
                            src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/1/19/Oxygen.png"
                            alt=""
                          />
                          <span>
                            {nmbFormat(
                              dino.wild_oxygen *
                                dino.Dino.base_stats["o"]["w"] +
                                dino.oxygen * dino.Dino.base_stats["o"]["t"] +
                                dino.Dino.base_stats["o"]["b"]
                            )}
                          </span>
                        </p>
                        <p className="text-center">
                          ({dino.wild_oxygen}-{dino.oxygen})
                        </p>
                        <p className="inline-flex space-x-2">
                          <img
                            className="h-6 w-6"
                            src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/0/01/Melee_Damage.png"
                            alt=""
                          />
                          <span>
                            {dino.wild_melee_damage *
                              dino.Dino.base_stats["d"]["w"] +
                              dino.melee_damage *
                                dino.Dino.base_stats["d"]["t"] +
                              dino.Dino.base_stats["d"]["b"]}
                            %
                          </span>
                        </p>
                        <p className="text-center">
                          ({dino.wild_melee_damage}-{dino.melee_damage})
                        </p>
                        <p className="inline-flex space-x-2">
                          <img
                            className="h-6 w-6"
                            src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/c/c6/Food.png"
                            alt=""
                          />
                          <span>
                            {nmbFormat(
                              dino.wild_food * dino.Dino.base_stats["f"]["w"] +
                                dino.food * dino.Dino.base_stats["f"]["t"] +
                                dino.Dino.base_stats["f"]["b"]
                            )}
                          </span>
                        </p>
                        <p className="text-center">
                          ({dino.wild_food}-{dino.food})
                        </p>
                        <p className="inline-flex space-x-2">
                          <img
                            className="h-6 w-6"
                            src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/e/e1/Movement_Speed.png"
                            alt=""
                          />
                          <span>
                            {nmbFormat(
                              dino.wild_movement_speed *
                                dino.Dino.base_stats["m"]["w"] +
                                dino.movement_speed *
                                  dino.Dino.base_stats["m"]["t"] +
                                dino.Dino.base_stats["m"]["b"]
                            )}
                            %
                          </span>
                        </p>
                        <p className="text-center">
                          ({dino.wild_movement_speed}-{dino.movement_speed})
                        </p>
                      </div>
                      <div className="relative mt-3 h-8 w-full border border-[#97FBFF] bg-[#646665] text-center">
                        <div className="relative flex h-full w-full items-center border-2 border-[#0D2836]">
                          <div className="h-full w-full bg-gradient-to-t from-[#A30100] to-red-500"></div>
                          <span className="absolute w-full items-center text-base font-semibold">
                            {nmbFormat(
                              dino.wild_health *
                                dino.Dino.base_stats["h"]["w"] +
                                dino.health * dino.Dino.base_stats["h"]["t"] +
                                dino.Dino.base_stats["h"]["b"]
                            )}
                            /
                            {nmbFormat(
                              dino.wild_health *
                                dino.Dino.base_stats["h"]["w"] +
                                dino.health * dino.Dino.base_stats["h"]["t"] +
                                dino.Dino.base_stats["h"]["b"]
                            )}{" "}
                            Health ({dino.wild_health}-{dino.health})
                          </span>
                        </div>
                      </div>
                      <div className="relative mt-2 h-8 w-full border border-[#97FBFF] bg-[#646665] text-center">
                        <div className="relative flex h-full w-full items-center border-2 border-[#0D2836]">
                          <div className="h-full w-full bg-gradient-to-t from-[#009136] to-green-500"></div>
                          <span className="absolute w-full items-center text-base font-semibold">
                            {nmbFormat(
                              dino.wild_food * dino.Dino.base_stats["f"]["w"] +
                                dino.food * dino.Dino.base_stats["f"]["t"] +
                                dino.Dino.base_stats["f"]["b"]
                            )}
                            /
                            {nmbFormat(
                              dino.wild_food * dino.Dino.base_stats["f"]["w"] +
                                dino.food * dino.Dino.base_stats["f"]["t"] +
                                dino.Dino.base_stats["f"]["b"]
                            )}{" "}
                            Food ({dino.wild_food}-{dino.food})
                          </span>
                        </div>
                      </div>
                      <div className="relative mt-2 h-8 w-full border border-[#97FBFF] bg-[#646665] text-center">
                        <div className="relative flex h-full w-full items-center border-2 border-[#0D2836]">
                          <div className="h-full w-full bg-gradient-to-t from-[#A340B7] to-fuchsia-500"></div>
                          <span className="absolute w-full items-center text-base font-semibold">
                            {nmbFormat(
                              dino.wild_torpor *
                                dino.Dino.base_stats["t"]["w"] +
                                dino.torpor * dino.Dino.base_stats["t"]["t"] +
                                dino.Dino.base_stats["t"]["b"]
                            )}
                            /
                            {nmbFormat(
                              dino.wild_torpor *
                                dino.Dino.base_stats["t"]["w"] +
                                dino.torpor * dino.Dino.base_stats["t"]["t"] +
                                dino.Dino.base_stats["t"]["b"]
                            )}{" "}
                            Torpor ({dino.wild_torpor}-{dino.torpor})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </article>
  );
};

export default TimelineBasespot;
