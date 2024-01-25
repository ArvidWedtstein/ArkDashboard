import {
  navigate,
  parseSearch,
  routes,
  useParams,
} from "@redwoodjs/router";
import { CheckboxField, Form, Label } from "@redwoodjs/forms/dist";
import type { FindDinos } from "types/graphql";
import { Fragment, useMemo, useState } from "react";
import clsx from "clsx";
import Disclosure from "src/components/Util/Disclosure/Disclosure";
import { Modal, useModal } from "src/components/Util/Modal/Modal";
import { Input } from "src/components/Util/Input/Input";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
} from "src/components/Util/Card/Card";
import {
  ToggleButton,
  ToggleButtonGroup,
} from "src/components/Util/ToggleButton/ToggleButton";
import Button, { ButtonGroup } from "src/components/Util/Button/Button";
import Text from "src/components/Util/Text/Text";

const DinosList = ({
  dinosPage,
  loading,
}: FindDinos & {
  loading: boolean;
}) => {
  let { search, temperament, diet, type } = useParams();

  type FormFindDinos = NonNullable<{
    diet: string;
    search: string;
    temperament: string;
    type: string;
  }>;
  const { openModal } = useModal();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<{
    column: string;
    direction: "asc" | "desc";
  }>({
    column: "",
    direction: "asc",
  });

  const onSubmit = (e: FormFindDinos) => {
    navigate(
      routes.dinos({
        ...parseSearch(
          Object.fromEntries(
            Object.entries(e).filter(([_, v]) => v != "")
          ) as FormFindDinos
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

  const Filters = useMemo(
    () => (
      <Fragment>
        <h3 className="sr-only">Categories</h3>
        <Disclosure title="Type">
          <div className="flex flex-col space-y-5">
            {Object.keys(dinoTypes).map((dinotype) => (
              <div
                className="flex items-center space-x-2"
                key={`type-${dinotype}`}
              >
                <CheckboxField
                  name="type"
                  id={`type-${dinotype}`}
                  className="rw-checkbox"
                  value={dinotype}
                  defaultChecked={type && type.includes(dinotype)}
                  errorClassName="rw-checkbox rw-input-error"
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
            {(dinosPage.diets as { diet: string }[])
              .filter(({ diet }) => diet != null)
              .map(({ diet: dinodiet }) => (
                <div
                  className="flex items-center space-x-2"
                  key={`diet-${dinodiet}`}
                >
                  <CheckboxField
                    name="diet"
                    id={`diet-${dinodiet}`}
                    className="rw-checkbox"
                    value={dinodiet}
                    errorClassName="rw-checkbox rw-input-error"
                    defaultChecked={(diet && diet.includes(dinodiet)) || false}
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
            {(dinosPage.temperaments as { temperament: string }[])
              .filter(({ temperament }) => temperament != null)
              .map(({ temperament: dinotemperament }) => (
                <div
                  className="flex items-center space-x-2"
                  key={`dino-temp-${dinotemperament}`}
                >
                  <CheckboxField
                    id={`temperament-${dinotemperament}`}
                    name="temperament"
                    className="rw-checkbox"
                    errorClassName="rw-checkbox rw-input-error"
                    value={dinotemperament}
                    defaultChecked={
                      temperament && temperament.includes(dinotemperament)
                    }
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
      </Fragment>
    ),
    []
  );
  return (
    <Form<FormFindDinos> className="rw-segment" onSubmit={onSubmit}>
      {window.innerWidth < 1024 && <Modal content={Filters} />}

      <div className="flex flex-col items-center justify-between border-b border-zinc-500 pb-6 pt-1 text-gray-900 dark:text-white sm:flex-row">
        <Text variant="h4">
          Dinos
        </Text>

        <div className="flex items-center justify-center space-x-2">
          <ButtonGroup>
            <Button
              to={routes.newDino()}
              color="success"
              variant="outlined"
              permission="basespot_create"
              className="grow"
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                </svg>
              }
            >
              New Dino
            </Button>

            <Lookup
              label="Sort by"
              margin="none"
              className="hidden capitalize sm:inline-flex"
              name="sort"
              defaultValue={sort.column}
              disabled={loading}
              onSelect={(e) => {
                setSort((prev) => ({
                  ...prev,
                  column: e ? e.toString() : "",
                }));
              }}
              closeOnSelect
              options={Object.keys(dinosPage.dinos[0] || {}).filter(
                (c) => !["__typename", "id", "image", "blueprint"].includes(c)
              )}
            />

            <Button
              variant="outlined"
              color="DEFAULT"
              onClick={() => {
                setSort((prev) => ({
                  ...prev,
                  direction: prev.direction === "asc" ? "desc" : "asc",
                }));
              }}
              title={sort.direction == "asc" ? "Ascending " : "Descending"}
              className="!border-white/20 border-x-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className={clsx(
                  "w-4 fill-current transition-transform duration-150 ease-out",
                  {
                    "rotate-180 transform": sort.direction === "desc",
                  }
                )}
              >
                <path d="M32.05 224h255.9c28.36 0 42.73-34.5 22.62-54.62l-127.1-128c-12.5-12.5-32.86-12.5-45.36 0L9.304 169.4C-10.69 189.5 3.682 224 32.05 224zM160 63.98L287.1 192h-255.9L160 63.98z" />
              </svg>
            </Button>

            <Button
              variant="outlined"
              color="DEFAULT"
              onClick={() => openModal()}
              className="lg:!hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-4 fill-current"
              >
                <path d="M479.3 32H32.7C5.213 32-9.965 63.28 7.375 84.19L192 306.8V400c0 7.828 3.812 15.17 10.25 19.66l80 55.98C286.5 478.6 291.3 480 295.9 480C308.3 480 320 470.2 320 455.1V306.8l184.6-222.6C521.1 63.28 506.8 32 479.3 32zM295.4 286.4L288 295.3v145.3l-64-44.79V295.3L32.7 64h446.6l.6934-.2422L295.4 286.4z" />
              </svg>
              <span className="sr-only">Filters</span>
            </Button>

            <Input
              variant="outlined"
              color="DEFAULT"
              margin="none"
              name="search"
              type="search"
              label="Search"
              defaultValue={search}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <Button
                    variant="contained"
                    color="success"
                    disabled={loading}
                    type="submit"
                    ignoreButtonGroupPosition
                    startIcon={(
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M507.3 484.7l-141.5-141.5C397 306.8 415.1 259.7 415.1 208c0-114.9-93.13-208-208-208S-.0002 93.13-.0002 208S93.12 416 207.1 416c51.68 0 98.85-18.96 135.2-50.15l141.5 141.5C487.8 510.4 491.9 512 496 512s8.188-1.562 11.31-4.688C513.6 501.1 513.6 490.9 507.3 484.7zM208 384C110.1 384 32 305 32 208S110.1 32 208 32S384 110.1 384 208S305 384 208 384z" />
                      </svg>
                    )}
                  >
                    <span className="hidden md:block">Search</span>
                  </Button>
                ),
              }}
            />
          </ButtonGroup>

          <ToggleButtonGroup
            orientation="horizontal"
            value={view}
            exclusive
            enforce
            onChange={(_, value) => setView(value)}
          >
            <ToggleButton value="list">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-5 w-5 fill-current"
              >
                <path d="M64 48H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 62.33 81.67 48 64 48zM64 112H32v-32h32V112zM64 368H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 382.3 81.67 368 64 368zM64 432H32v-32h32V432zM176 112h320c8.801 0 16-7.201 16-15.1C512 87.2 504.8 80 496 80h-320C167.2 80 160 87.2 160 95.1C160 104.8 167.2 112 176 112zM496 240h-320C167.2 240 160 247.2 160 256c0 8.799 7.201 16 16 16h320C504.8 272 512 264.8 512 256C512 247.2 504.8 240 496 240zM496 400h-320C167.2 400 160 407.2 160 416c0 8.799 7.201 16 16 16h320c8.801 0 16-7.201 16-16C512 407.2 504.8 400 496 400zM64 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 222.3 81.67 208 64 208zM64 272H32v-32h32V272z" />
              </svg>
            </ToggleButton>
            <ToggleButton value="grid">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-5 w-5 fill-current"
              >
                <path d="M160 0H64C28.65 0 0 28.65 0 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64V64C224 28.65 195.3 0 160 0zM192 160c0 17.64-14.36 32-32 32H64C46.36 192 32 177.6 32 160V64c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V160zM160 288H64c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64v-96C224 316.7 195.3 288 160 288zM192 448c0 17.64-14.36 32-32 32H64c-17.64 0-32-14.36-32-32v-96c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V448zM448 0h-96c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64V64C512 28.65 483.3 0 448 0zM480 160c0 17.64-14.36 32-32 32h-96c-17.64 0-32-14.36-32-32V64c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V160zM448 288h-96c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64v-96C512 316.7 483.3 288 448 288zM480 448c0 17.64-14.36 32-32 32h-96c-17.64 0-32-14.36-32-32v-96c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V448z" />
              </svg>
            </ToggleButton>
          </ToggleButtonGroup>
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
              "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4":
                view === "grid",
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
            ({
              id,
              name,
              type,
              image,
              icon,
              description,
              tamable,
              temperament,
            }) => (
              <Card
                key={`dino-${id}`}
                className="hover:border-success-500 cursor-pointer border border-transparent transition-all duration-75 ease-in-out"
              >
                <CardActionArea
                  to={routes.dino({ id })}
                  component="link"
                  className="w-full text-left"
                >
                  <CardHeader
                    title={name}
                    subheader={temperament}
                    className="border-b border-zinc-500"
                    avatar={
                      <div className="overflow-hidden rounded-full p-1 ring-1 ring-zinc-500">
                        <img
                          src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/DinoIcon/${icon}`}
                          className="h-8 w-8 invert"
                          loading="lazy"
                          alt={name}
                        />
                      </div>
                    }
                    action={
                      type &&
                      type.map((type) => (
                        <img
                          key={`dino-${id}-${type}`}
                          className="m-4 w-8"
                          title={type}
                          src={dinoTypes[type]}
                        />
                      ))
                    }
                  />

                  <CardMedia
                    className="mx-auto aspect-square h-auto min-w-[200px] overflow-hidden p-4"
                    component="img"
                    loading="lazy"
                    image={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/${image}`}
                  />
                  {description && (
                    <CardContent>
                      <p className="truncate text-sm" title={description}>
                        {description}
                      </p>
                    </CardContent>
                  )}
                </CardActionArea>
              </Card>
            )
          )}
        </div>
      </section>
    </Form>
  );
};

export default DinosList;
