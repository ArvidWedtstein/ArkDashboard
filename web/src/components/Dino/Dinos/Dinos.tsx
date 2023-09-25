import {
  Link,
  navigate,
  parseSearch,
  routes,
  useParams,
} from "@redwoodjs/router";
import {
  CheckboxField,
  FieldError,
  Form,
  Label,
  SearchField,
  SelectField,
  Submit,
} from "@redwoodjs/forms";

import type { FindDinos } from "types/graphql";
import { useContext, useMemo, useState } from "react";
import clsx from "clsx";
import Disclosure from "src/components/Util/Disclosure/Disclosure";
import { Modal, ModalContext } from "src/components/Util/Modal/Modal";
import { Input2 } from "src/components/Util/Input/Input";

const DinosList = ({ dinosPage }: FindDinos) => {
  let { search, temperament, diet, type } = useParams();

  type FormFindDnios = NonNullable<{
    diet: string;
    search: string;
    temperament: string;
    type: string;
  }>;
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<{
    column: string;
    direction: "asc" | "desc";
  }>({
    column: "",
    direction: "asc",
  });


  const onSubmit = (e: FormFindDnios) => {
    navigate(
      routes.dinos({
        ...parseSearch(
          Object.fromEntries(
            Object.entries(e).filter(([_, v]) => v != "")
          ) as FormFindDnios
        ),
        page: 1,
      })
    );
  };

  const dinoTypes = {
    ground:
      "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/f/f5/Slow.png",
    flyer:
      "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/7/78/Landing.png",
    water:
      "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/9/9d/Water.png",
    amphibious:
      "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/4/44/Swim_Mode.png",
    boss: "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/5/50/Cowardice.png",
  };
  const { openModal } = useContext(ModalContext);
  const Filters = useMemo(
    () => (
      <>
        <h3 className="sr-only">Categories</h3>
        <Disclosure title="Type">
          <div className="flex flex-col space-y-5">
            {Object.keys(dinoTypes).map((dinotype) => (
              <div className="flex items-center space-x-2" key={`type-${dinotype}`}>
                <CheckboxField
                  name="type"
                  id={`type-${dinotype}`}
                  className="rw-input"
                  value={dinotype}
                  errorClassName="rw-input rw-input-error"
                  defaultChecked={type && type.includes(dinotype)}
                />
                <Label
                  name="type"
                  htmlFor={`type-${dinotype}`}
                  className="rw-sublabel capitalize"
                  errorClassName="rw-sublabel rw-label-error"
                >
                  {dinotype}
                </Label>
              </div>
            ))}
          </div>
        </Disclosure>
        <Disclosure title="Diet">
          <div className="flex flex-col space-y-5">
            {(dinosPage.diets as { diet: string }[]).filter(({ diet }) => diet != null).map(({ diet: dinodiet }) => (
              <div className="flex items-center space-x-2" key={`diet-${dinodiet}`}>
                <CheckboxField
                  name="diet"
                  id={`diet-${dinodiet}`}
                  className="rw-input"
                  value={dinodiet}
                  errorClassName="rw-input rw-input-error"
                  defaultChecked={diet && diet.includes(dinodiet) || false}
                />
                <Label
                  name="diet"
                  htmlFor={`diet-${dinodiet}`}
                  className="rw-sublabel capitalize"
                  errorClassName="rw-sublabel rw-label-error"
                >
                  {dinodiet}
                </Label>
              </div>
            ))}
          </div>
        </Disclosure>
        <Disclosure title="Temperament">
          <div className="flex flex-col space-y-5">
            {(dinosPage.temperaments as { temperament: string }[]).filter(({ temperament }) => temperament != null).map(({ temperament: dinotemperament }) => (
              <div className="flex items-center space-x-2" key={`dino-temp-${dinotemperament}`}>
                <CheckboxField
                  id={`temperament-${dinotemperament}`}
                  name="temperament"
                  className="rw-input"
                  value={dinotemperament}
                  errorClassName="rw-input rw-input-error"
                  defaultChecked={temperament && temperament.includes(dinotemperament)}
                />
                <Label
                  name="temperament"
                  htmlFor={`temperament-${dinotemperament}`}
                  className="rw-sublabel capitalize"
                  errorClassName="rw-sublabel rw-label-error"
                >
                  {dinotemperament}
                </Label>
              </div>
            ))}
          </div>
        </Disclosure>
      </>
    ),
    []
  );
  return (
    <Form<FormFindDnios> className="rw-segment" onSubmit={onSubmit}>
      {window.innerWidth < 1024 && <Modal content={Filters} />}

      <div className="flex flex-col items-baseline justify-between border-b border-zinc-500 pb-6 pt-24 text-gray-900 dark:text-white sm:flex-row md:pt-6">
        <h1 className="py-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:p-0">
          Dinos
        </h1>

        <div className="flex items-center">
          <div className="rw-button-group ml-5">
            <SelectField
              className="rw-input capitalize"
              name="sort"
              defaultValue={sort.column}
              onChange={(e) => {
                setSort((prev) => ({
                  ...prev,
                  column: e.target.value,
                }));
              }}
            >
              {Object.keys(dinosPage.dinos[0] || {})
                .filter(
                  (c) => !["__typename", "id", "image", "blueprint"].includes(c)
                )
                .map((key) => (
                  <option className="capitalize" key={key} value={key}>
                    {key}
                  </option>
                ))}
            </SelectField>

            <button
              type="button"
              className="rw-button rw-button-gray !border-l-transparent transition-all duration-150 ease-in-out"
              onClick={() => {
                setSort((prev) => ({
                  ...prev,
                  direction: prev.direction === "asc" ? "desc" : "asc",
                }));
              }}
              title={sort.direction == "asc" ? "Ascending " : "Descending"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className={clsx(
                  "rw-button-icon-start transition-transform duration-150 ease-out",
                  {
                    "rotate-180 transform": sort.direction === "desc",
                  }
                )}
              >
                <path d="M32.05 224h255.9c28.36 0 42.73-34.5 22.62-54.62l-127.1-128c-12.5-12.5-32.86-12.5-45.36 0L9.304 169.4C-10.69 189.5 3.682 224 32.05 224zM160 63.98L287.1 192h-255.9L160 63.98z" />
              </svg>
            </button>
          </div>

          <div className="rw-button-group ml-5">
            <input
              type="radio"
              id="list"
              name="view"
              value="list"
              className="peer/list hidden"
              checked={view === "list"}
              onChange={() => setView("list")}
            />
            <input
              type="radio"
              id="grid"
              name="view"
              value="grid"
              className="peer/grid hidden"
              checked={view === "grid"}
              onChange={() => setView("grid")}
            />
            <label
              htmlFor="list"
              className="rw-button rw-button-gray peer-checked/list:!border-pea-500 h-full !rounded-r-none !rounded-l-lg border peer-checked/grid:border-r-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="rw-button-icon h-5 w-5"
              >
                <path d="M64 48H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 62.33 81.67 48 64 48zM64 112H32v-32h32V112zM64 368H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 382.3 81.67 368 64 368zM64 432H32v-32h32V432zM176 112h320c8.801 0 16-7.201 16-15.1C512 87.2 504.8 80 496 80h-320C167.2 80 160 87.2 160 95.1C160 104.8 167.2 112 176 112zM496 240h-320C167.2 240 160 247.2 160 256c0 8.799 7.201 16 16 16h320C504.8 272 512 264.8 512 256C512 247.2 504.8 240 496 240zM496 400h-320C167.2 400 160 407.2 160 416c0 8.799 7.201 16 16 16h320c8.801 0 16-7.201 16-16C512 407.2 504.8 400 496 400zM64 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 222.3 81.67 208 64 208zM64 272H32v-32h32V272z" />
              </svg>
            </label>
            <label
              htmlFor="grid"
              className="rw-button rw-button-gray peer-checked/grid:!border-pea-500 border peer-checked/list:!border-l-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="rw-button-icon h-5 w-5"
              >
                <path d="M160 0H64C28.65 0 0 28.65 0 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64V64C224 28.65 195.3 0 160 0zM192 160c0 17.64-14.36 32-32 32H64C46.36 192 32 177.6 32 160V64c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V160zM160 288H64c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64v-96C224 316.7 195.3 288 160 288zM192 448c0 17.64-14.36 32-32 32H64c-17.64 0-32-14.36-32-32v-96c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V448zM448 0h-96c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64V64C512 28.65 483.3 0 448 0zM480 160c0 17.64-14.36 32-32 32h-96c-17.64 0-32-14.36-32-32V64c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V160zM448 288h-96c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64v-96C512 316.7 483.3 288 448 288zM480 448c0 17.64-14.36 32-32 32h-96c-17.64 0-32-14.36-32-32v-96c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V448z" />
              </svg>
            </label>
          </div>

          <button
            type="button"
            onClick={() => openModal()}
            className="rw-button rw-button-gray-outline ml-4 sm:ml-6 lg:!hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="rw-button-icon">
              <path d="M479.3 32H32.7C5.213 32-9.965 63.28 7.375 84.19L192 306.8V400c0 7.828 3.812 15.17 10.25 19.66l80 55.98C286.5 478.6 291.3 480 295.9 480C308.3 480 320 470.2 320 455.1V306.8l184.6-222.6C521.1 63.28 506.8 32 479.3 32zM295.4 286.4L288 295.3v145.3l-64-44.79V295.3L32.7 64h446.6l.6934-.2422L295.4 286.4z" />
            </svg>
            <span className="sr-only">Filters</span>
          </button>

          <Label name="search" className="sr-only">
            Search
          </Label>

          <SearchField
            name="search"
            className="rw-input ml-4 !mt-0 hidden !w-full grow sm:ml-6 lg:block"
            placeholder="Search..."
            defaultValue={search}
          />

          <FieldError name="search" className="rw-field-error" />

          <Submit className="rw-button rw-button-green ml-2 bg-clip-padding">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="rw-button-icon-start"
            >
              <path d="M507.3 484.7l-141.5-141.5C397 306.8 415.1 259.7 415.1 208c0-114.9-93.13-208-208-208S-.0002 93.13-.0002 208S93.12 416 207.1 416c51.68 0 98.85-18.96 135.2-50.15l141.5 141.5C487.8 510.4 491.9 512 496 512s8.188-1.562 11.31-4.688C513.6 501.1 513.6 490.9 507.3 484.7zM208 384C110.1 384 32 305 32 208S110.1 32 208 32S384 110.1 384 208S305 384 208 384z" />
            </svg>
            <span className="hidden md:block">Search</span>
          </Submit>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-x-8 gap-y-10 pb-24 pt-6 lg:grid-cols-4">
        {/* Filters */}
        <div className="hidden lg:block">{Filters}</div>

        {/* Dinos grid */}
        <div
          className={clsx(
            "grid w-full gap-6 text-zinc-900 transition-all ease-in-out dark:text-white lg:col-span-3",
            {
              "grid-cols-1": view === "list",
              "grid-cols-1 lg:grid-cols-3 xl:grid-cols-4": view === "grid",
            }
          )}
        >
          {(dinosPage.count === 0 || dinosPage.dinos.length == 0) && (
            <div className="col-span-full">
              <div className="text-center text-black dark:text-white">
                <p>No dinos found with that name</p>
              </div>
            </div>
          )}
          {dinosPage.dinos.map(
            ({ id, name, type, image, description, tamable, temperament }) => (
              <Link
                to={routes.dino({ id: id })}
                className="animate-fade-in relative flex h-96 max-h-min flex-1 flex-col overflow-hidden rounded-lg border border-black bg-white text-center dark:border-zinc-500"
                key={`dino-${id}`}
              >
                <div
                  className="relative mb-10 h-52 rounded-t-lg"
                  style={{
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    backgroundImage: `url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/barbarian-bg.jpg')`,
                  }}
                >
                  <img
                    src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/${image}`}
                    className="absolute top-1 max-h-64 w-auto p-3"
                    loading="lazy"
                    alt={name}
                  />
                </div>
                <div className="mb-0.5 text-xs font-bold uppercase text-neutral-600">
                  {temperament}
                </div>
                <div className="mb-1 text-2xl font-black text-black">{name}</div>
                <div
                  className="mb-2 flex-grow truncate p-5 text-stone-500"
                  title={description}
                >
                  {description}
                </div>

                <div className="flex flex-row justify-center rounded-b-lg border-t border-neutral-600 bg-stone-200 font-bold text-white">
                  {type &&
                    type.map((type) => (
                      <img
                        key={`dino-${id}-${type}`}
                        className="m-4 w-8"
                        title={type}
                        src={dinoTypes[type]}
                      />
                    ))}
                </div>
              </Link>
            )
          )}
        </div>
      </section>
    </Form>
  );
};

export default DinosList;
