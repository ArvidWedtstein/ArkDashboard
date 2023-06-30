import {
  CheckboxField,
  DatetimeLocalField,
  FieldError,
  Label,
  TextAreaField,
  TextField,
} from "@redwoodjs/forms";
import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useAuth } from "src/auth";
import ImageContainer from "src/components/Util/ImageContainer/ImageContainer";
import Lookup from "src/components/Util/Lookup/Lookup";
import Map from "src/components/Util/Map/Map";
import { Modal, RefModal } from "src/components/Util/Modal/Modal";
import Slideshow from "src/components/Util/Slideshow/Slideshow";

import {
  ArrayElement,
  formatBytes,
  formatNumber,
  getDateDiff,
  pluralize,
  timeTag,
  truncate,
} from "src/lib/formatters";

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

const CREATE_TIMELINE_BASESPOT_RAID_MUTATION = gql`
  mutation CreateTimelineBasespotRaidMutation(
    $input: CreateTimelineBasespotRaidInput!
  ) {
    createTimelineBasespotRaid(input: $input) {
      id
    }
  }
`;

const CREATE_TIMELINE_BASESPOT_PERSON_MUTATION = gql`
  mutation CreateTimelineBasespotPersonMutation(
    $input: CreateTimelineBasespotPersonInput!
  ) {
    createTimelineBasespotPerson(input: $input) {
      id
    }
  }
`;

interface Props {
  timelineBasespot: NonNullable<FindTimelineBasespotById["timelineBasespot"]>;
}

const TimelineBasespot = ({ timelineBasespot }: Props) => {
  const {
    isAuthenticated,
    client: supabase,
    hasRole,
    error: authError,
    currentUser,
  } = useAuth();

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

  const onDeleteClick = (id: DeleteTimelineBasespotMutationVariables["id"]) => {
    if (
      confirm("Are you sure you want to delete timelineBasespot " + id + "?")
    ) {
      deleteTimelineBasespot({ variables: { id } });
    }
  };

  const [createTimelineBasespotRaid, { loading: timelimeBasespotRaidLoading }] = useMutation(
    CREATE_TIMELINE_BASESPOT_RAID_MUTATION,
    {
      onCompleted: () => {
        toast.success("TimelineBasespot raid initiated");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const [createTimelineBasespotPerson, { loading: timelimeBasespotPersonLoading }] = useMutation(
    CREATE_TIMELINE_BASESPOT_PERSON_MUTATION,
    {
      onCompleted: () => {
        toast.success("Person added to this basespot!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const [isRaided, setIsRaided] = useState(false);
  const initRaid = () => {
    if (confirm("Are you sure you are being raided?")) {
      setIsRaided(true);
      setIsComponentVisible(false);
    }
  };

  const formatter = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  });

  const [images, setImages] = useState([]);
  const [personLookup, setPersonLookup] = useState<{ id: String, full_name?: string, avatar_url?: string }[]>([]);

  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const [currentModalImage, setCurrentModalImage] = useState(null);

  useEffect(() => {
    supabase.storage
      .from("timelineimages")
      .list(timelineBasespot.id.toString())
      .then(({ data, error }) => {
        if (error) throw error;
        if (data) {
          setImages(data.filter((f) => f.name !== ".emptyFolderPlaceholder"));
        }
      });

    supabase
      .from("Profile")
      .select("id, full_name, avatar_url")
      .then(({ data, error }) => {
        if (error) throw error;
        if (data) {
          setPersonLookup(data);
        }
      });
  }, []);


  const renderDinoCardStat = (stat: 'stamina' | 'melee_damage' | 'movement_speed' | 'health' | 'food' | 'weight' | 'oxygen', dino: ArrayElement<FindTimelineBasespotById["timelineBasespot"]["TimelineBasespotDino"]>) => {
    let char = stat[0]
    if (stat === 'melee_damage') char = 'd'
    return (
      <>
        <p className="inline-flex space-x-2">
          <img
            className="h-6 w-6"
            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${stat}.webp`}
            alt=""
          />
          <span>
            {formatNumber(
              dino[`wild_${stat}`] *
              dino.Dino.base_stats[char]["w"] +
              dino[stat] *
              dino.Dino.base_stats[char]["t"] +
              dino.Dino.base_stats[char]["b"],
              { notation: "compact" }
            )}
            {stat === 'movement_speed' || stat === 'melee_damage' && '%'}
          </span>
        </p>
        <p className="text-center">
          ({dino[`wild_${stat}`]}-{dino[stat]})
        </p>
      </>
    )
  }

  function convertToDate(dateString) {
    const year = dateString.substr(0, 4);
    const month = dateString.substr(4, 2) - 1; // subtract 1 to account for zero-based month numbering
    const day = dateString.substr(6, 2);
    const hour = dateString.substr(8, 2);
    const minute = dateString.substr(10, 2);
    const second = dateString.substr(12, 2);

    return new Date(year, month, day, hour, minute, second);
  }

  return (
    <article className="rw-segment">
      <RefModal
        isOpen={isComponentVisible}
        onClose={() => setIsComponentVisible(false)}
        // setIsOpen={(open) => setIsComponentVisible(open)}
        image={currentModalImage}
      />

      {/* TODO: move to own page? */}
      <Modal
        isOpen={isRaided}
        onClose={() => setIsRaided(false)}
        form={
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg text-gray-700 dark:text-white">
              Please fill out the form below to report the raid.
            </p>
            <fieldset className="rw-form-group">
              <legend>Raid Form</legend>
              <div>
                <div>
                  <Label
                    name="raid_start"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Raid Start date
                  </Label>

                  <DatetimeLocalField
                    name="raid_start"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    validation={{ required: true }}
                  />

                  <FieldError name="raid_start" className="rw-field-error" />
                </div>
                <div>
                  <Label
                    name="raid_end"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Raid End date
                  </Label>

                  <DatetimeLocalField
                    name="raid_end"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    emptyAs={null}
                  />

                  <FieldError name="raid_end" className="rw-field-error" />
                </div>
              </div>
              <div>
                <div>
                  <Label
                    name="raid_comment"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Raid Comment
                  </Label>

                  <TextAreaField
                    name="raid_comment"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                  />

                  <FieldError name="raid_comment" className="rw-field-error" />
                </div>
                <div>
                  <Label
                    name="attackers"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Attackers
                  </Label>

                  <TextAreaField
                    name="attackers"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                  />
                  <p className="rw-helper-text">
                    Player names, comma seperated
                  </p>

                  <FieldError name="attackers" className="rw-field-error" />
                </div>
                <div>
                  <Label
                    name="base_survived"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Base Survived?
                  </Label>

                  <CheckboxField
                    name="base_survived"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                  />
                  <p className="rw-helper-text">Did base survived raid?</p>

                  <FieldError name="base_survived" className="rw-field-error" />
                </div>
              </div>
              <div>
                <div>
                  <Label
                    name="tribe_name"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Tribe Name
                  </Label>

                  <TextField
                    name="tribe_name"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                  />
                  <p className="rw-helper-text">
                    Name of tribe who started the raid
                  </p>

                  <FieldError name="tribe_name" className="rw-field-error" />
                </div>
                <div>
                  <Label
                    name="defenders"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Defenders
                  </Label>

                  <TextAreaField
                    name="defenders"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                  />
                  <p className="rw-helper-text">
                    Name of players who defended, comma seperated
                  </p>

                  <FieldError name="defenders" className="rw-field-error" />
                </div>
              </div>
            </fieldset>
          </div>
        }
        formSubmit={(data) => {
          data.preventDefault();
          const formData = new FormData(data.currentTarget);
          createTimelineBasespotRaid({
            variables: {
              input: {
                raid_start: formData.get("raid_start") || new Date(),
                raid_end: convertToDate(formData.get("raid_end")),
                raid_comment: formData.get("raid_comment"),
                attacker_players: formData.get("attacker_players"),
                base_survived: formData.get("base_survived"),
                tribe_name: formData.get("tribe_name"),
                defenders: formData.get("defenders"),
              },
            },
          });
          setIsRaided(false);
        }}
      />

      <div className="m-2 block rounded-md text-white">
        <section className="body-font container mx-auto flex flex-col items-center px-5 py-12 md:flex-row">
          <div className="mb-16 space-y-2 flex flex-col items-center text-center md:mb-0 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
            <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 dark:text-zinc-200 sm:text-4xl">
              {timelineBasespot.tribe_name}
            </h1>
            <p className="leading-relaxed">
              This time we played on
              {` ${timelineBasespot?.server} ${timelineBasespot?.cluster} Season ${timelineBasespot.season}`}
            </p>
            <div className="flex space-x-1 flex-wrap justify-start xl:space-y-0 md:space-y-1">
              {isAuthenticated && (
                <>
                  {hasRole("timeline_update") ||
                    (currentUser && currentUser.permissions.some(
                      (p) => p === "timeline_update"
                    ) && (
                        <Link
                          to={routes.editTimelineBasespot({
                            id: timelineBasespot.id.toString(),
                          })}
                          className="rw-button rw-button-gray-outline"
                        >
                          Edit
                        </Link>
                      ))}
                  {hasRole("timeline_delete") ||
                    (currentUser && currentUser.permissions.some(
                      (p) => p === "timeline_delete"
                    ) && (
                        <button
                          onClick={() => onDeleteClick(timelineBasespot.id)}
                          className="rw-button rw-button-red-outline"
                        >
                          Delete
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="rw-button-icon"
                          >
                            <path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                          </svg>
                        </button>
                      ))}
                  {(!timelineBasespot.TimelineBasespotRaid.find(
                    (f) => f.base_survived === false
                  ) &&
                    new Date(timelineBasespot.start_date) < new Date() &&
                    !timelineBasespot.end_date &&
                    timelineBasespot.TimelineBasespotPerson.some(
                      (p) => p.user_id === currentUser.id
                    )) ||
                    (currentUser.permissions.some(
                      (p) => p === "timeline_update"
                    ) && (
                        <button
                          className="rw-button rw-button-red-outline"
                          onClick={() => initRaid()}
                          disabled={timelimeBasespotRaidLoading}
                        >
                          Raid
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                            className="rw-button-icon"
                          >
                            <path d="M285.3 247.1c-3.093-4.635-8.161-7.134-13.32-7.134c-8.739 0-15.1 7.108-15.1 16.03c0 3.05 .8717 6.133 2.693 8.859l52.37 78.56l-76.12 25.38c-6.415 2.16-10.94 8.159-10.94 15.18c0 2.758 .7104 5.498 2.109 7.946l63.1 112C293.1 509.1 298.5 512 304 512c11.25 0 15.99-9.84 15.99-16.02c0-2.691-.6807-5.416-2.114-7.915L263.6 393l77.48-25.81c1.701-.5727 10.93-4.426 10.93-15.19c0-3.121-.9093-6.205-2.685-8.873L285.3 247.1zM575.1 256c0-4.435-1.831-8.841-5.423-12l-58.6-51.87c.002-.0938 0 .0938 0 0l.0247-144.1c0-8.844-7.156-16-15.1-16L400 32c-8.844 0-15.1 7.156-15.1 16l-.0014 31.37L298.6 4c-3.016-2.656-6.797-3.997-10.58-3.997c-3.781 0-7.563 1.34-10.58 3.997l-271.1 240C1.831 247.2 .0007 251.6 .0007 256c0 8.92 7.239 15.99 16.04 15.99c3.757 0 7.52-1.313 10.54-3.993l37.42-33.02V432c0 44.13 35.89 80 79.1 80h63.1c8.844 0 15.1-7.156 15.1-16S216.8 480 208 480h-63.1c-26.47 0-47.1-21.53-47.1-48v-224c0-.377-.1895-.6914-.2148-1.062L288 37.34l192.2 169.6C480.2 207.3 479.1 207.6 479.1 208v224c0 26.47-21.53 48-47.1 48h-31.1c-8.844 0-15.1 7.156-15.1 16s7.156 16 15.1 16h31.1c44.11 0 79.1-35.88 79.1-80V234.1L549.4 268C552.5 270.7 556.2 272 559.1 272C568.7 272 575.1 264.9 575.1 256zM479.1 164.1l-63.1-56.47V64h63.1V164.1z" />
                          </svg>
                        </button>
                      ))}

                  {(timelineBasespot.TimelineBasespotPerson.some(
                    (p) => p.user_id === currentUser.id
                  ) ||
                    currentUser.permissions.some(
                      (p) => p === "timeline_update"
                    )) && (
                      <>
                        <Link
                          to={routes.newTimelineBasespotDino({
                            id: timelineBasespot.id,
                          })}
                          className="rw-button rw-button-green-outline"
                        >
                          Dino
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="rw-button-icon">
                            <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                          </svg>
                        </Link>
                        <Lookup
                          disabled={timelimeBasespotPersonLoading}
                          placeholder="Add Person"
                          options={personLookup.filter((p) => p.full_name != null).map((p) => ({
                            label: p.full_name,
                            value: p.id,
                            image: p.avatar_url ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${p.avatar_url}` : `https://ui-avatars.com/api/?name=${p.full_name}`,
                          }))}
                          onSelect={(e) => {
                            createTimelineBasespotPerson({
                              variables: {
                                input: {
                                  timelinebasespot_id: timelineBasespot.id,
                                  user_id: e.value,
                                }
                              }
                            })
                          }} />
                      </>
                    )}
                </>
              )}
            </div>
          </div>
          {images.length > 0 && (
            <div className="w-5/6 md:w-1/2 lg:w-full lg:max-w-lg">
              <ImageContainer
                className="rounded-lg object-cover object-center"
                src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineBasespot.id}/${images[0].name}`}
                caption={timeTag(timelineBasespot.start_date)}
              />
            </div>
          )}
        </section>

        <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-gray-200 dark:text-neutral-200">
          <div className="container mx-auto flex flex-wrap px-5 py-12">
            <div className="mb-10 w-full overflow-hidden text-base lg:mb-0 lg:w-1/2">
              <p>Started playing on {timeTag(timelineBasespot.start_date)}.</p>
              {timelineBasespot.start_date &&
                timelineBasespot.TimelineBasespotRaid.length > 0 &&
                timelineBasespot.TimelineBasespotRaid.find(
                  (f) => f.base_survived === false
                ) && (
                  <p>
                    Base lasted{" "}
                    {
                      getDateDiff(
                        new Date(timelineBasespot.start_date),
                        new Date(
                          timelineBasespot.TimelineBasespotRaid.find(
                            (f) => f.base_survived === false
                          ).raid_end
                        )
                      ).dateString
                    }
                  </p>
                )}
            </div>
          </div>
        </section>

        {timelineBasespot.TimelineBasespotRaid.length > 0 && (
          <section className="body-font relative mx-4 border-t border-gray-700 text-stone-300 dark:border-gray-200">
            <h1
              id="raid-heading"
              className="title-font mt-8 text-center text-xl font-medium text-gray-900 dark:text-neutral-200 sm:text-3xl"
            >
              {pluralize(
                timelineBasespot.TimelineBasespotRaid.length,
                "Raid",
                "s",
                false
              )}
            </h1>

            <Slideshow
              className="mb-6"
              aria-labelledby="raid-heading"
              controls={true}
              autoPlay={false}
              slides={timelineBasespot.TimelineBasespotRaid.map(
                ({
                  id,
                  raid_comment,
                  raid_start,
                  raid_end,
                  tribe_name,
                  base_survived,
                }) => {
                  return {
                    tabColor: `bg-pea-500`,
                    content: (
                      <div key={id} className="flex justify-center px-5 py-12">
                        <div className="text-center lg:w-3/4 xl:w-1/2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            className="mb-8 inline-block h-8 w-8 text-black dark:text-white"
                            viewBox="0 0 975.036 975.036"
                          >
                            <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                          </svg>
                          <p className="text-lg leading-relaxed">
                            {raid_comment &&
                              raid_comment.split("\n").map((w, idx) => (
                                <span
                                  className="block"
                                  key={`raid-comment-${idx}`}
                                >
                                  {w.replace("\\n", "")}
                                </span>
                              ))}
                          </p>

                          <span className="bg-pea-500 mt-8 mb-6 inline-block h-1 w-10 rounded" />
                          <h2 className="text-sm text-stone-400">
                            Raided by{" "}
                            <span className="title-font font-medium tracking-wider">
                              {tribe_name}
                            </span>
                          </h2>
                          <p className="text-gray-500">
                            {timeTag(raid_start)} - {timeTag(raid_end)}
                          </p>
                          <p className="text-gray-500">
                            {`Base ${base_survived ? "survived" : "did not survive"
                              }`}
                          </p>
                        </div>
                      </div>
                    ),
                  };
                }
              )}
            />
          </section>
        )}

        <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-gray-200 dark:text-neutral-200">
          <div className="container mx-auto flex flex-wrap px-5 py-12">
            <div className="mb-10 w-full overflow-hidden rounded-lg lg:mb-0 lg:w-1/2">
              {timelineBasespot.map && (
                <Map
                  className="h-full w-full object-cover object-center"
                  url={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${timelineBasespot.Map.img}`}
                  size={{ width: 500, height: 500 }}
                  pos={[
                    {
                      lat: timelineBasespot.basespot ? timelineBasespot.basespot.latitude : timelineBasespot.latitude,
                      lon: timelineBasespot.basespot ? timelineBasespot.basespot.longitude : timelineBasespot.longitude,
                      name: timelineBasespot?.basespot?.name,
                    },
                  ]}
                  interactive={true}
                />
              )}
            </div>
            <div className="-mb-10 flex flex-col flex-wrap text-center lg:w-1/2 lg:py-6 lg:pl-12 lg:text-left">
              <div className="mb-10 flex flex-col items-center lg:items-start">
                <div className="dark:bg-pea-50 text-pea-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    fill="currentColor"
                    className="h-6 w-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <path d="M560.02 32c-1.96 0-3.98.37-5.96 1.16L384.01 96H384L212 35.28A64.252 64.252 0 0 0 191.76 32c-6.69 0-13.37 1.05-19.81 3.14L20.12 87.95A32.006 32.006 0 0 0 0 117.66v346.32C0 473.17 7.53 480 15.99 480c1.96 0 3.97-.37 5.96-1.16L192 416l172 60.71a63.98 63.98 0 0 0 40.05.15l151.83-52.81A31.996 31.996 0 0 0 576 394.34V48.02c0-9.19-7.53-16.02-15.98-16.02zM224 90.42l128 45.19v285.97l-128-45.19V90.42zM48 418.05V129.07l128-44.53v286.2l-.64.23L48 418.05zm480-35.13l-128 44.53V141.26l.64-.24L528 93.95v288.97z" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-neutral-200">
                    Coordinates
                  </h2>
                  <p className="text-base leading-relaxed">
                    Our base{" "}
                    {timelineBasespot.TimelineBasespotRaid.some(
                      (f) => !f.base_survived
                    )
                      ? "was "
                      : "is "}
                    located at: {timelineBasespot.basespot ? timelineBasespot.basespot.latitude : timelineBasespot.latitude}{" "}
                    <abbr title="Latitude">Lat</abbr>,{" "}
                    {timelineBasespot.basespot ? timelineBasespot.basespot.longitude : timelineBasespot.longitude}{" "}
                    <abbr title="Longitude">Lon</abbr> on the map{" "}
                    <Link
                      to={routes.map({ id: timelineBasespot.map.toString() })}
                    >
                      {timelineBasespot?.Map?.name}
                    </Link>
                  </p>
                </div>
              </div>
              {timelineBasespot.basespot && (
                <div className="mb-10 flex flex-col items-center lg:items-start">
                  <div className="dark:bg-pea-50 text-pea-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 288 512"
                      fill="currentColor"
                      className="h-6 w-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M112 316.94v156.69l22.02 33.02c4.75 7.12 15.22 7.12 19.97 0L176 473.63V316.94c-10.39 1.92-21.06 3.06-32 3.06s-21.61-1.14-32-3.06zM144 0C64.47 0 0 64.47 0 144s64.47 144 144 144 144-64.47 144-144S223.53 0 144 0zm0 76c-37.5 0-68 30.5-68 68 0 6.62-5.38 12-12 12s-12-5.38-12-12c0-50.73 41.28-92 92-92 6.62 0 12 5.38 12 12s-5.38 12-12 12z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-neutral-200">
                      Base
                    </h2>
                    <p className="text-base leading-relaxed">
                      Our basespot was{" "}
                      <Link
                        to={routes.basespot({
                          id: timelineBasespot.basespot.id.toString(),
                        })}
                      >
                        {timelineBasespot.basespot.name}
                      </Link>
                    </p>
                  </div>
                </div>
              )}
              <div className="mb-10 flex flex-col items-center lg:items-start">
                <div className="dark:bg-pea-50 text-pea-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-200">
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
                    {timelineBasespot.TimelineBasespotPerson.length > 0
                      ? formatter.format(
                        timelineBasespot.TimelineBasespotPerson.map(
                          (p) =>
                            // p.user_id ? (
                            //   <Link to={routes.profile({ id: p.user_id })}>
                            //     {p.ingame_name}
                            //   </Link>
                            // ) : (
                            //   p.ingame_name
                            // )
                            p.ingame_name
                        )
                      )
                      : "none"}
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
                Images & Screenshots taken during this base
              </h2>
              <h1 className="title-font text-2xl font-medium text-gray-900 dark:text-neutral-200 sm:text-3xl">
                Images
              </h1>
            </div>

            <div className="flex flex-wrap gap-5">
              {images.map((img, i) => (
                <div
                  key={`image-${i}`}
                  className={clsx("block", {
                    "basis-1/2": i % 4 === 0,
                    "basis-[23%]": i % 4 !== 0,
                  })}
                >
                  <div className="flex h-full justify-between">
                    <button
                      className={"group relative flex h-auto w-full overflow-hidden rounded-xl"}
                      onClick={() => {
                        setCurrentModalImage(
                          `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineBasespot.id}/${img.name}`
                        );
                        setIsComponentVisible(true);
                        setIsRaided(false);
                      }}
                    >
                      <img
                        className="h-full w-full object-cover transition-all duration-200 ease-in group-hover:scale-110"
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineBasespot.id}/${img.name}`}
                        alt=""
                      />
                      <div
                        className="absolute flex h-full w-full flex-col items-end justify-end p-3"
                        style={{
                          background:
                            "linear-gradient(0deg, #001022cc 0%, #f0f4fd33 90%)",
                        }}
                      >
                        <div className="flex w-full justify-between text-left">
                          <div className="w-full">
                            <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-white">
                              {img.name}
                            </p>
                            {img.metadata?.size && (
                              <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-white">
                                {formatBytes(img.metadata.size)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="absolute right-3 top-3 z-10 rounded-[10px] bg-[#8b9ca380] py-1 px-3 text-sm text-white">
                        {/* {new Date(img.updated_at).toLocaleTimeString("de", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} */}
                        {/* <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                          fill="currentColor"
                          className="mr-1 inline-block h-4 w-4 text-white"
                        >
                          <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" />
                        </svg> */}
                        {convertToDate(
                          img.name.replace("_1.jpg", "")
                        ).toLocaleString("de", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }) === "Invalid Date"
                          ? new Date(img.created_at).toLocaleString("de", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                          : convertToDate(
                            img.name.replace("_1.jpg", "")
                          ).toLocaleString("de", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

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
                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/DinoIcon/${dino.Dino.icon}`}
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
                        {renderDinoCardStat('stamina', dino)}
                        {renderDinoCardStat('weight', dino)}
                        {renderDinoCardStat('oxygen', dino)}
                        {renderDinoCardStat('melee_damage', dino)}
                        {renderDinoCardStat('food', dino)}
                        {renderDinoCardStat('movement_speed', dino)}
                      </div>
                      <div className="relative mt-3 h-8 w-full border border-[#97FBFF] bg-[#646665] text-center">
                        <div className="relative flex h-full w-full items-center border-2 border-[#0D2836]">
                          <div className="h-full w-full bg-gradient-to-t from-[#A30100] to-red-500"></div>
                          <span className="absolute w-full items-center text-base font-semibold">
                            {formatNumber(
                              dino.wild_health *
                              dino.Dino.base_stats["h"]["w"] +
                              dino.health * dino.Dino.base_stats["h"]["t"] +
                              dino.Dino.base_stats["h"]["b"],
                              { notation: "compact" }
                            )}
                            /
                            {formatNumber(
                              dino.wild_health *
                              dino.Dino.base_stats["h"]["w"] +
                              dino.health * dino.Dino.base_stats["h"]["t"] +
                              dino.Dino.base_stats["h"]["b"],
                              { notation: "compact" }
                            )}{" "}
                            Health ({dino.wild_health}-{dino.health})
                          </span>
                        </div>
                      </div>
                      <div className="relative mt-2 h-8 w-full border border-[#97FBFF] bg-[#646665] text-center">
                        <div className="relative flex h-full w-full items-center border-2 border-[#0D2836]">
                          <div className="h-full w-full bg-gradient-to-t from-[#009136] to-green-500"></div>
                          <span className="absolute w-full items-center text-base font-semibold">
                            {formatNumber(
                              dino.wild_food * dino.Dino.base_stats["f"]["w"] +
                              dino.food * dino.Dino.base_stats["f"]["t"] +
                              dino.Dino.base_stats["f"]["b"],
                              { notation: "compact" }
                            )}
                            /
                            {formatNumber(
                              dino.wild_food * dino.Dino.base_stats["f"]["w"] +
                              dino.food * dino.Dino.base_stats["f"]["t"] +
                              dino.Dino.base_stats["f"]["b"],
                              { notation: "compact" }
                            )}{" "}
                            Food ({dino.wild_food}-{dino.food})
                          </span>
                        </div>
                      </div>
                      <div className="relative mt-2 h-8 w-full border border-[#97FBFF] bg-[#646665] text-center">
                        <div className="relative flex h-full w-full items-center border-2 border-[#0D2836]">
                          <div className="h-full w-full bg-gradient-to-t from-[#A340B7] to-fuchsia-500"></div>
                          <span className="absolute w-full items-center text-base font-semibold">
                            0 / 0
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
