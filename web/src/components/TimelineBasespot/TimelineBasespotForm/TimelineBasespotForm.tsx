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
import { useAuth } from "@redwoodjs/auth";
import { useEffect, useState } from "react";
import clsx from "clsx";
import MapPicker from "src/components/Util/MapPicker/MapPicker";
import FileUpload from "src/components/Util/FileUpload/FileUpload";
import { nmbFormat, timeTag, truncate } from "src/lib/formatters";
import { Link } from "@redwoodjs/router";
import { routes } from "@redwoodjs/router";

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, "");
  }
};

type FormTimelineBasespot = NonNullable<
  EditTimelineBasespotById["timelineBasespot"]
>;

interface TimelineBasespotFormProps {
  timelineBasespot?: EditTimelineBasespotById["timelineBasespot"];
  onSave: (
    data: UpdateTimelineBasespotInput,
    id?: FormTimelineBasespot["id"]
  ) => void;
  error: RWGqlError;
  loading: boolean;
}

const TimelineBasespotForm = (props: TimelineBasespotFormProps) => {
  let { isAuthenticated, client: supabase } = useAuth();
  let [basespots, setBasespots] = useState([]);
  let [selectedBasespot, setSelectedBasespot] = useState(null);
  const formMethods = useForm<FormTimelineBasespot>();
  const { setValue, control, watch } = formMethods;

  const onSubmit = (data: FormTimelineBasespot) => {
    if (selectedBasespot) {
      data.map = selectedBasespot?.Map;
      data.location = {
        lat: selectedBasespot?.latitude,
        lon: selectedBasespot?.longitude,
      };
    }
    formMethods.reset();
    props.onSave(data, props?.timelineBasespot?.id);
  };
  const getBasespots = async () => {
    let { data, error, status } = await supabase
      .from("Basespot")
      .select(`id, name, Map, latitude, longitude`);

    if (error && status !== 406) {
      throw error;
    }
    if (data) {
      setBasespots(data);
    }
  };
  useEffect(() => {
    getBasespots();

    props?.timelineBasespot?.basespot_id
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

  // let { handleSubmit, control } = useForm<FormTimelineBasespot>({
  //   defaultValues: {
  //     timeline_id: props?.timelineBasespot?.timeline_id,
  //     startDate: formatDatetime(props?.timelineBasespot?.startDate),
  //     endDate: formatDatetime(props?.timelineBasespot?.endDate),
  //     basespot_id: props?.timelineBasespot?.basespot_id,
  //     location: props?.timelineBasespot?.location,
  //     map: props?.timelineBasespot?.map,

  //   },
  // })

  const map: any = watch("map");
  return (
    <div className="rw-form-wrapper">
      <Form<FormTimelineBasespot>
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
          defaultValue={props.timelineBasespot?.timeline_id}
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
                name="startDate"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Start date
              </Label>

              <DatetimeLocalField
                name="startDate"
                defaultValue={formatDatetime(props.timelineBasespot?.startDate)}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                emptyAs={null}
                validation={{ required: true }}
              />

              <FieldError name="startDate" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="endDate"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                End date
              </Label>

              <DatetimeLocalField
                name="endDate"
                defaultValue={formatDatetime(props.timelineBasespot?.endDate)}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                emptyAs={null}
              />

              <FieldError name="endDate" className="rw-field-error" />
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
          items={[
            { name: "Valguero", value: "1" },
            { name: "The Island", value: "2" },
            { name: "The Center", value: "3" },
            { name: "Ragnarok", value: "4" },
            { name: "Aberration", value: "5" },
            { name: "Extinction", value: "6" },
            { name: "Scorched Earth", value: "7" },
            { name: "Genesis", value: "8" },
            { name: "Genesis 2", value: "9" },
            { name: "Crystal Isles", value: "10" },
            { name: "Fjordur", value: "11" },
            { name: "Lost Island", value: "12" },
          ]}
          name="map"
          defaultValue={props.timelineBasespot?.map.toString()}
          onChange={(e) => {
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
          defaultValue={
            props.timelineBasespot?.basespot_id
              ? basespots.find(
                (b) => b.id === props.timelineBasespot?.basespot_id
              ).name
              : null
          }
          items={
            props.timelineBasespot?.map
              ? basespots.filter((b) => b.Map === map)
              : basespots
          }
          onChange={(e) => setSelectedBasespot(e)}
          name="basespot_id"
        />

        <FieldError name="basespot_id" className="rw-field-error" />

        <MapPicker
          map={map || props.timelineBasespot?.map}
          valueProp={{
            latitude: props.timelineBasespot?.location["lat"],
            longitude: props.timelineBasespot?.location["lon"],
          }}
          onChanges={(e) => {
            formMethods.setValue(
              "location",
              JSON.stringify({ lat: e.latitude, lon: e.longitude })
            );
          }}
        />

        <Label
          name="tribeName"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Tribe name
        </Label>

        <TextField
          name="tribeName"
          defaultValue={props.timelineBasespot?.tribeName}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="tribeName" className="rw-field-error" />

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
          Location
        </Label>

        <TextAreaField
          name="location"
          defaultValue={JSON.stringify(props.timelineBasespot?.location)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />

        <FieldError name="location" className="rw-field-error" />

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
              e.length > 0 ? e.split(",").map((s) => s.trim()) : null,
          }}
        />
        <p className="rw-helper-text">Player names, comma seperated</p>

        <FieldError name="players" className="rw-field-error" />

        {(true || !props.timelineBasespot?.endDate) && (
          <fieldset className="rw-form-group">
            <legend>Raid Info</legend>
            <div>
              <div>
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
                  name="raidcomment"
                  className="rw-label"
                  errorClassName="rw-label rw-label-error"
                >
                  Raid Comment
                </Label>

                <TextAreaField
                  name="raidcomment"
                  defaultValue={props.timelineBasespot?.raidcomment}
                  className="rw-input"
                  errorClassName="rw-input rw-input-error"
                />

                <FieldError name="raidcomment" className="rw-field-error" />
              </div>
            </div>
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
                  <Link className="w-1/3 max-w-3xl p-2" key={`dino-${i}`} to={routes.editTimelineBasespotDino({ id: dino.id.toString() })}>
                    <div className="border border-[#97FBFF] bg-[#0D2836] p-4">
                      <div className="flex flex-row space-x-3">
                        <div className="h-28 w-28 overflow-hidden border border-[#97FBFF]">
                          <img
                            style={{
                              filter:
                                "invert(95%) sepia(69%) saturate(911%) hue-rotate(157deg) brightness(100%) contrast(103%)",
                            }}
                            className="h-full w-full object-cover object-center p-2"
                            src={`https://arkids.net/image/creature/120/${dino.Dino.name
                              .toLowerCase()
                              .replaceAll(" ", "-")
                              .replace("spinosaurus", "spinosaur")
                              .replaceAll("ö", "o")
                              .replaceAll("tek", "")
                              .replaceAll("paraceratherium", "paracer")
                              .replace("&", "")
                              .replace("prime", "")
                              .replace(",masteroftheocean", "")
                              .replace("insectswarm", "bladewasp")}.png`}
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
                            {dino.birth_date != null && dino.death_date != null ? `${timeTag(dino.birth_date)} - ${timeTag(dino.death_date)}` : props.timelineBasespot.tribeName}
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
                              dino.wild_stamina * dino.Dino.base_stats["s"]["w"] +
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
                              dino.wild_weight * dino.Dino.base_stats["w"]["w"] +
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
                              dino.wild_oxygen * dino.Dino.base_stats["o"]["w"] +
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
                              dino.melee_damage * dino.Dino.base_stats["d"]["t"] +
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
                              dino.wild_health * dino.Dino.base_stats["h"]["w"] +
                              dino.health * dino.Dino.base_stats["h"]["t"] +
                              dino.Dino.base_stats["h"]["b"]
                            )}
                            /
                            {nmbFormat(
                              dino.wild_health * dino.Dino.base_stats["h"]["w"] +
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
                              dino.wild_torpor * dino.Dino.base_stats["t"]["w"] +
                              dino.torpor * dino.Dino.base_stats["t"]["t"] +
                              dino.Dino.base_stats["t"]["b"]
                            )}
                            /
                            {nmbFormat(
                              dino.wild_torpor * dino.Dino.base_stats["t"]["w"] +
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
          </fieldset>)}

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  );
};

export default TimelineBasespotForm;
