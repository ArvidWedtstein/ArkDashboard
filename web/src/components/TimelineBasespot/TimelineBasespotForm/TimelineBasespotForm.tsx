import {
  Form,
  FormError,
  FieldError,
  Label,
  DatetimeLocalField,
  TextField,
  TextAreaField,
  Submit,
  SelectField,
  useForm,
  useFieldArray,
} from "@redwoodjs/forms";

import type {
  EditTimelineBasespotById,
  UpdateTimelineBasespotInput,
} from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import Lookup from "src/components/Util/Lookup/Lookup";
import { useEffect, useState } from "react";
import clsx from "clsx";
import MapPicker from "src/components/Util/MapPicker/MapPicker";
import FileUpload from "src/components/Util/FileUpload/FileUpload";
import { nmbFormat, timeTag, truncate } from "src/lib/formatters";
import { Link } from "@redwoodjs/router";
import { routes } from "@redwoodjs/router";
import { useAuth } from "src/auth";

const formatDatetime = (value) => {
  if (value) {
    return value.toString().replace(/:\d{2}\.\d{3}\w/, "");
  }
};

type FormTimelineBasespot = NonNullable<
  EditTimelineBasespotById["timelineBasespot"]
>;

interface TimelineBasespotFormProps {
  id?: string;
  timelineBasespot?: EditTimelineBasespotById["timelineBasespot"];
  onSave: (
    data: UpdateTimelineBasespotInput,
    id?: FormTimelineBasespot["id"]
  ) => void;
  error: RWGqlError;
  loading: boolean;
}

const TimelineBasespotForm = (props: TimelineBasespotFormProps) => {
  let { client: supabase } = useAuth();
  let [basespots, setBasespots] = useState([]);
  let [selectedBasespot, setSelectedBasespot] = useState(null);
  const formMethods = useForm<
    FormTimelineBasespot & { "TimelineBasespotRaid.upsert": any[] }
  >({
    defaultValues: {
      ...props.timelineBasespot,
      "TimelineBasespotRaid.upsert": [],
    },
  });
  const { setValue, control, watch, register } = formMethods;

  const {
    fields: raidFields,
    append: appendRaid,
    remove: removeRaid,
  } = useFieldArray<any>({
    control,
    name: "TimelineBasespotRaid.upsert",
  });

  const onSubmit = (data: FormTimelineBasespot) => {
    data.TimelineBasespotRaid["upsert"] = data.TimelineBasespotRaid[
      "upsert"
    ].map((u, i) => ({
      create: { ...u },
      update: { ...u },
      where: {
        id:
          props.timelineBasespot?.TimelineBasespotRaid[i]?.id ||
          "00000000000000000000000000000000",
      },
    }));

    if (selectedBasespot) {
      data.map = selectedBasespot?.map;

      data.latitude = selectedBasespot?.latitude;
      data.longitude = selectedBasespot?.longitude;
    }
    formMethods.reset();
    props.onSave(data, props?.timelineBasespot?.id);
  };
  const getBasespots = async () => {
    let { data, error, status } = await supabase
      .from("Basespot")
      .select(`id, name, map, latitude, longitude`);

    if (error && status !== 406) {
      throw error;
    }
    if (data) {
      setBasespots(data);
    }
  };
  useEffect(() => {
    getBasespots();

    basespots.length > 0 && props?.timelineBasespot?.basespot_id
      ? setSelectedBasespot(
          basespots.find((b) => b.id === props?.timelineBasespot?.basespot_id)
        )
      : null;
  }, []);

  useEffect(() => {
    if (selectedBasespot) {
      formMethods.setValue("basespot_id", selectedBasespot.value as any);
    }
  }, [selectedBasespot, setSelectedBasespot]);

  const map: any = watch("map");
  return (
    <div className="rw-form-wrapper">
      <Form<FormTimelineBasespot & { "TimelineBasespotRaid.upsert": any[] }>
        onSubmit={onSubmit}
        formMethods={formMethods}
        error={props.error}
      >
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="timeline_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Timeline id
        </Label>

        <TextField
          name="timeline_id"
          defaultValue={props?.id || props.timelineBasespot?.timeline_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="timeline_id" className="rw-field-error" />

        <fieldset className="rw-form-group">
          <legend>Base Duration</legend>
          <div>
            <div>
              <Label
                name="start_date"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Start date
              </Label>

              <DatetimeLocalField
                name="start_date"
                defaultValue={formatDatetime(
                  props.timelineBasespot?.start_date
                )}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                emptyAs={null}
                validation={{ required: true }}
              />

              <FieldError name="start_date" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="end_date"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                End date
              </Label>

              <DatetimeLocalField
                name="end_Date"
                defaultValue={formatDatetime(props.timelineBasespot?.end_date)}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                emptyAs={null}
              />

              <FieldError name="end_date" className="rw-field-error" />
            </div>
          </div>
        </fieldset>

        <Label
          name="map"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Map
        </Label>

        {/* TODO: Replace with maps from db */}

        <Lookup
          options={[
            { label: "Valguero", value: 1 },
            { label: "The Island", value: 2 },
            { label: "The Center", value: 3 },
            { label: "Ragnarok", value: 4 },
            { label: "Aberration", value: 5 },
            { label: "Extinction", value: 6 },
            { label: "Scorched Earth", value: 7 },
            { label: "Genesis", value: 8 },
            { label: "Genesis 2", value: 9 },
            { label: "Crystal Isles", value: 10 },
            { label: "Fjordur", value: 11 },
            { label: "Lost Island", value: 12 },
          ]}
          name="map"
          defaultValue={props.timelineBasespot?.map.toString()}
          onSelect={(e) => {
            setValue("map", parseInt(e.value));
          }}
        />

        <FieldError name="map" className="rw-field-error" />

        <Label
          name="basespot_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Basespot
        </Label>

        <Lookup
          defaultValue={props.timelineBasespot?.basespot_id}
          options={basespots
            .filter((b) => b.map === map)
            .map((b) => ({
              label: b.name,
              value: b.id,
            }))}
          onSelect={(e) => setSelectedBasespot(e)}
          name="basespot_id"
        />

        <FieldError name="basespot_id" className="rw-field-error" />

        <MapPicker
          map={map || props.timelineBasespot?.map}
          valueProp={
            selectedBasespot !== null
              ? {
                  latitude: basespots.find(
                    (b) => b.id === selectedBasespot.value
                  ).latitude,
                  longitude: basespots.find(
                    (b) => b.id === selectedBasespot.value
                  ).longitude,
                }
              : {
                  latitude: props.timelineBasespot?.latitude,
                  longitude: props.timelineBasespot?.latitude,
                }
          }
          validation={{
            disabled: selectedBasespot !== null,
          }}
          onChanges={(e) => {
            formMethods.setValue("latitude", e.latitude);
            formMethods.setValue("longitude", e.longitude);
          }}
        />

        <Label
          name="tribe_name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Tribe name
        </Label>

        <TextField
          name="tribe_name"
          defaultValue={props.timelineBasespot?.tribe_name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="tribe_name" className="rw-field-error" />

        <fieldset className="rw-form-group">
          <legend>Server Info</legend>
          <div>
            <div>
              <Label
                name="server"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Server
              </Label>

              <TextField
                name="server"
                defaultValue={props.timelineBasespot?.server}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />

              <FieldError name="server" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="region"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Region
              </Label>

              <TextField
                name="region"
                defaultValue={props.timelineBasespot?.region}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />

              <FieldError name="region" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="season"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Season
              </Label>

              <TextField
                name="season"
                defaultValue={props.timelineBasespot?.season}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />

              <FieldError name="season" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="cluster"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Cluster
              </Label>

              <TextField
                name="cluster"
                defaultValue={props.timelineBasespot?.cluster}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />

              <FieldError name="cluster" className="rw-field-error" />
            </div>
          </div>
        </fieldset>

        <Label
          name="location"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Latitude
        </Label>

        <TextField
          name="latitude"
          defaultValue={props.timelineBasespot?.latitude}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="latitude" className="rw-field-error" />

        <Label
          name="longitude"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Longitude
        </Label>

        <TextField
          name="longitude"
          defaultValue={props.timelineBasespot?.longitude}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="longitude" className="rw-field-error" />

        <Label
          name="players"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Players
        </Label>

        <TextField
          name="players"
          defaultValue={props.timelineBasespot?.players.join(", ")}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={""}
          validation={{
            required: false,
            setValueAs: (e) =>
              !!!e && e.length > 0 ? e.split(",").map((s) => s.trim()) : null,
          }}
        />
        <p className="rw-helper-text">Player names, comma seperated</p>

        <FieldError name="players" className="rw-field-error" />

        {(true || !props.timelineBasespot?.end_date) && (
          <fieldset className="rw-form-group">
            <legend>Raids</legend>
            {/* TODO: add rest of raid input fields */}
            {raidFields.map((raid, index) => (
              <>
                <div
                  className="rw-button-group !mt-0 justify-start"
                  role="group"
                  key={`raid-${index}`}
                >
                  <div>
                    <Label
                      name={`TimelineBasespotRaid.upsert.${index}.tribe_name`}
                      className="rw-label"
                      errorClassName="rw-label rw-label-error"
                    >
                      Raided by
                    </Label>

                    <TextField
                      {...register(
                        `TimelineBasespotRaid.upsert.${index}.tribe_name`,
                        { required: true }
                      )}
                      className="rw-input !rounded-l-lg !rounded-r-none"
                      defaultValue={raid.tribe_name}
                    />
                  </div>
                  <div className="!ml-0">
                    <Label
                      name={`TimelineBasespotRaid.upsert.${index}.raid_comment`}
                      className="rw-label"
                      errorClassName="rw-label rw-label-error"
                    >
                      Raid Comment
                    </Label>

                    <TextField
                      {...register(
                        `TimelineBasespotRaid.upsert.${index}.raid_comment`,
                        { required: false }
                      )}
                      className="rw-input !rounded-r-none"
                      defaultValue={raid.raid_comment}
                    />
                  </div>
                  <div className="!ml-0 place-self-end">
                    <button
                      type="button"
                      className="rw-button rw-button-red !ml-0 !mt-0 rounded-none !rounded-r-md"
                      onClick={() => removeRaid(index)}
                    >
                      Remove Raid
                    </button>
                  </div>
                </div>
                <div>
                  <div>
                    <Label
                      name={`TimelineBasespotRaid.upsert.${index}.raid_start`}
                      className="rw-label"
                      errorClassName="rw-label rw-label-error"
                    >
                      Raid Start
                    </Label>

                    <DatetimeLocalField
                      {...register(
                        `TimelineBasespotRaid.upsert.${index}.raid_start`,
                        { required: true, valueAsDate: true }
                      )}
                      defaultValue={formatDatetime(raid.raid_start)}
                      errorClassName="rw-input rw-input-error"
                      emptyAs={null}
                      className="rw-input"
                    />
                  </div>
                  <div>
                    <Label
                      name={`TimelineBasespotRaid.upsert.${index}.raid_end`}
                      className="rw-label"
                      errorClassName="rw-label rw-label-error"
                    >
                      Raid End
                    </Label>

                    <DatetimeLocalField
                      {...register(
                        `TimelineBasespotRaid.upsert.${index}.raid_end`,
                        { required: true, valueAsDate: true }
                      )}
                      defaultValue={formatDatetime(raid.raid_end)}
                      emptyAs={null}
                      errorClassName="rw-input rw-input-error"
                      className="rw-input"
                    />
                  </div>
                </div>
              </>
            ))}
            <div className="rw-button-group justify-start">
              <button
                type="button"
                className="rw-button rw-button-gray"
                onClick={() =>
                  appendRaid({
                    raid_start: new Date().toISOString(),
                    raid_end: "",
                    tribe_name: "",
                    raid_comment: "",
                    attacker_players: "",
                    base_survived: false,
                    defenders: "",
                  })
                }
              >
                Add Raid
              </button>
            </div>
            {/* <div>
                <Label
                  name="raided_by"
                  className="rw-label"
                  errorClassName="rw-label rw-label-error"
                >
                  Raided by
                </Label>

                <TextField
                  name="raided_by"
                  defaultValue={props.timelineBasespot?.raided_by}
                  className="rw-input"
                  errorClassName="rw-input rw-input-error"
                />
                <p className="rw-helper-text">
                  The name of the tribe you got raided by
                </p>

                <FieldError name="raided_by" className="rw-field-error" />
              </div>
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
                  defaultValue={props.timelineBasespot?.raid_comment}
                  className="rw-input"
                  errorClassName="rw-input rw-input-error"
                />

                <FieldError name="raid_comment" className="rw-field-error" />
              </div> */}
          </fieldset>
        )}

        {props.timelineBasespot?.id && (
          <FileUpload
            multiple={true}
            storagePath={`timelineimages/${props.timelineBasespot?.id}`}
          />
        )}

        {props.timelineBasespot?.id && (
          <fieldset className="rw-form-group">
            <legend>Dinos</legend>
            <div>
              <div className="flex flex-wrap">
                {props.timelineBasespot.TimelineBasespotDino.map((dino, i) => (
                  <Link
                    className="w-1/3 max-w-3xl p-2"
                    key={`dino-${i}`}
                    to={routes.editTimelineBasespotDino({
                      id: dino.id.toString(),
                    })}
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
                            alt="s"
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
                            {dino.birth_date != null && dino.death_date != null
                              ? `${timeTag(dino.birth_date)} - ${timeTag(
                                  dino.death_date
                                )}`
                              : props.timelineBasespot.tribe_name}
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
                  </Link>
                ))}
              </div>
            </div>
          </fieldset>
        )}

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>

          {/* <button className="rw-button rw-button-gray" onClick={props.onCancel}>
            Cancel
          </button> */}
        </div>
      </Form>
    </div>
  );
};

export default TimelineBasespotForm;
