import {
  Link,
  navigate,
  parseSearch,
  routes,
  useParams,
} from "@redwoodjs/router";
import {
  Form,
  Label,
  SearchField,
  SelectField,
  Submit,
  TextField,
} from "@redwoodjs/forms";

import type { FindDinos } from "types/graphql";

const DinosList = ({ dinosPage }: FindDinos) => {
  let { search, category } = useParams();
  const onSubmit = (e) => {
    navigate(
      routes.dinos({
        ...parseSearch(
          Object.fromEntries(
            Object.entries(e).filter(([_, v]) => v != "")
          ) as any
        ),
        page: 1,
      })
    );
  };
  const types = {
    boss: "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/5/50/Cowardice.png",
    flyer:
      "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/7/78/Landing.png",
    amphibious:
      "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/4/44/Swim_Mode.png",
    ground:
      "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/f/f5/Slow.png",
    water:
      "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/9/9d/Water.png",
  };
  return (
    <section className="">
      <Form className="flex w-auto" onSubmit={onSubmit}>
        <nav className="flex w-full flex-row justify-center space-x-2">
          <div className="rw-button-group !w-full !space-x-0">
            <Label name="category" className="sr-only">
              Choose a category
            </Label>
            <SelectField
              name="category"
              className="rw-input mt-0 !rounded-l-lg"
              defaultValue={category}
              validation={{
                required: false,
                validate: {
                  matchesInitialValue: (value) => {
                    return value !== "Choose a category" || "Select an Option";
                  },
                },
              }}
            >
              <option value="">Choose a category</option>
              <option value="boss">Boss</option>
              <option value="flyer">Flyer</option>
              <option value="water">Water</option>
              <option value="amphibious">Amphibious</option>
              <option value="ground">Ground</option>
            </SelectField>

            <Label name="search" className="sr-only">
              Search for dino
            </Label>
            <SearchField
              name="search"
              className="rw-input mt-0 !w-full"
              placeholder="Search..."
              defaultValue={search}
            />
            <Submit className="rw-button rw-button-gray rounded-l-none">
              Search
            </Submit>
          </div>
        </nav>
      </Form>

      {/* <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5 3xl:grid-cols-8"> */}
      <div className="3xl:grid-cols-6 grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {dinosPage.dinos.map(({ id, name, type, image, description, tamable, temperament }) => (
          // <Link
          //   key={`dino-${id}`}
          //   to={routes.dino({ id: id })}
          //   className="flex h-auto w-auto max-w-xs flex-row items-start justify-start rounded-md bg-zinc-600 p-4 text-center text-white ring ring-zinc-500 border border-zinc-700"
          // >
          //   <div className="flex h-full w-full flex-col items-start justify-between justify-items-stretch">
          //     <div className="relative mb-3 h-32 w-32 rounded-full border bg-gradient-to-br from-zinc-700 to-zinc-700">
          //       <img
          //         className="h-auto max-h-full"
          //         loading="lazy"
          //         src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/${image}`}
          //         onError={(e) => {
          //           e.currentTarget.src = `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/any-hat.png`;
          //           // e.currentTarget.parentElement.hidden = true;
          //           e.currentTarget.parentElement.parentElement.classList.replace(
          //             "justify-between",
          //             "justify-end"
          //           );
          //         }}
          //       />
          //     </div>
          //     <p className="tracking-wide subpixel-antialiased">{name}</p>
          //   </div>
          //   <div className="flex flex-col gap-1">
          //     {type &&
          //       type.map((type) => (
          //         <img
          //           key={`dino-${id}-${type}`}
          //           className="w-8"
          //           title={type}
          //           src={types[type]}
          //         />
          //       ))}
          //   </div>
          // </Link>
          <div className="rounded-lg clash-card barbarian flex h-full flex-1 flex-col overflow-hidden">
            <div className="clash-card__image clash-card__image--barbarian">
              <img
                src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/${image}`}
                className="max-h-64 w-auto p-3"
                alt={name}
              />
            </div>
            <div className="clash-card__level clash-card__level--barbarian">
              {temperament}
            </div>
            <div className="clash-card__unit-name">{name}</div>
            <div className="clash-card__unit-description flex-grow truncate">
              {description}
            </div>

            <div className="clash-card__unit-stats clash-card__unit-stats--barbarian clearfix">
              <div className="one-third">
                <div className="stat">
                  20<sup>XP</sup>
                </div>
                <div className="stat-value">XP per kill</div>
              </div>
              <div className="one-third">
                <div className="stat justify-center inline-flex items-center fill-white">{{
                  "amphibious": (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-6"><path d="M560 448h-40.81l-109.9-123.6l131.5-71.91C562.5 240.8 576 218.3 576 193.6c0-26.84-15.94-51-40.56-61.53c-30.63-13.12-59.45-22.2-88.24-28.06C443.1 63.63 409.4 32 368 32c-38.95 0-71.32 27.86-78.46 64.73C128.7 104.4 0 237.3 0 400C0 444.1 35.88 480 80 480h288c8.844 0 16-7.156 16-16S376.8 448 368 448h-288C53.53 448 32 426.5 32 400c0-145.2 114.5-263.8 257.8-271.3C297.5 164.9 329.6 192 368 192c35.81 0 65.76-23.68 75.96-56.12c25.68 5.471 51.47 13.86 78.88 25.62C535.7 167 544 179.6 544 193.6c0 12.84-7.031 24.62-18.47 30.78l-149.2 81.59c-4.25 2.344-7.25 6.5-8.062 11.28c-.8438 4.812 .5625 9.75 3.781 13.38l128 144C503.1 478 507.4 480 512 480h48c8.844 0 16-7.156 16-16S568.8 448 560 448zM368 128c15.06 0 29.67 1.078 44.15 2.801C404.8 147.9 387.8 160 368 160C341.5 160 320 138.5 320 112S341.5 64 368 64c21.82 0 40.08 14.73 45.89 34.71C398.9 97 383.7 96 368 96c-8.844 0-16 7.156-16 16S359.2 128 368 128zM281.3 365.5l-34.16 22.75c-7.344 4.906-9.344 14.81-4.438 22.19C245.8 415.1 250.8 417.6 256 417.6c3.062 0 6.156-.875 8.875-2.688l34.16-22.75c18.44-12.31 31-31.06 35.34-52.81s-.0313-43.91-12.34-62.34s-31.06-31-52.78-35.34C247.3 237.3 225.3 241.7 206.9 253.1L175.8 274.7C168.5 279.6 166.5 289.5 171.4 296.9s14.88 9.281 22.19 4.438l31.09-20.72C236 273 249.6 270.3 262.1 273c13.34 2.656 24.88 10.38 32.44 21.72s10.28 24.97 7.594 38.34C300.3 346.4 292.6 357.9 281.3 365.5z" /></svg>
                  ), "flyer": (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6"><path d="M248 159.3c-4.97 0-9.862-2.313-12.99-6.626C220.6 132.6 208.5 111.2 199.2 88.71c-3.001 6.907-5.798 13.94-7.986 20.41C188.3 117.5 179.2 121.9 170.9 119.1C162.5 116.3 158 107.2 160.8 98.81c7.377-21.69 19.65-46.75 27.44-59.29C191.7 34.14 197.1 31.39 204.1 32.11c6.283 .9063 11.44 5.407 13.16 11.53c9.08 32.35 23.79 62.72 43.7 90.32c5.173 7.188 3.563 17.19-3.61 22.35C254.6 158.4 251.3 159.3 248 159.3zM359.1 159.1c0 13.13 10.88 24 24.01 24s24.01-10.88 24.01-24c0-13.31-10.88-24-24.01-24S359.1 146.7 359.1 159.1zM512 63.97l-32 95.95l.002 128.2c0 88.37-71.62 159.9-160 159.9l-53.17 .1683l-63.89 54.75C200.4 505.2 191.2 512.6 177.7 511.1c-105.5-4.358-154.6-55.85-174.6-86.64c-7.013-10.78-1.653-25.19 10.83-28.31l128.6-32.18C41.64 283.2 31.32 195.1 31.94 153.1C32.45 112.1 41.76 75.1 57.76 41.09c5.826-12.38 23.7-11.86 29.21 .6633c57.44 130.6 185.3 155.4 200.1 158.2v-40.39c0-52.79 42.8-95.59 95.6-95.59c.1426 0 .2924 .0163 .435 .0163L512 63.97zM467.6 95.93h-83.64l-.3653 .0371c-35.09 .2031-63.65 28.84-63.65 64.09v78.13C299.1 235.8 156.3 226.2 74.15 87.05C67.65 108.6 64.15 130.7 63.9 153.4c-1.625 122.9 100.9 188.3 148.5 227l-170.8 42.75c21.51 24.5 62.76 53.75 137.4 56.88c.7502 0 76.02-63.88 76.02-63.88h64.89c70.64 0 128-57.51 128-128V154.7L467.6 95.93z" /></svg>
                  ), "ground": (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-6"><path d="M180.7 395.3C183.8 398.4 187.9 400 192 400s8.188-1.562 11.31-4.688l144-144c6.25-6.25 6.25-16.38 0-22.62s-16.38-6.25-22.62 0L208 345.4V48C208 39.16 200.8 32 192 32S176 39.16 176 48v297.4L59.31 228.7c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62L180.7 395.3zM368 448h-352C7.156 448 0 455.2 0 464S7.156 480 16 480h352c8.844 0 16-7.156 16-16S376.8 448 368 448z" /></svg>
                  )
                }[type[0]]}</div>
                <div className="stat-value">{type[0]}</div>
              </div>

              <div className="one-third no-border">
                <div className="stat justify-center inline-flex items-center">
                  {tamable ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="fill-pea-500 h-8 w-8"
                    >
                      <path d="M475.3 123.3l-272 272C200.2 398.4 196.1 400 192 400s-8.188-1.562-11.31-4.688l-144-144c-6.25-6.25-6.25-16.38 0-22.62s16.38-6.25 22.62 0L192 361.4l260.7-260.7c6.25-6.25 16.38-6.25 22.62 0S481.6 117.1 475.3 123.3z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                      className="h-8 w-8 fill-red-500"
                    >
                      <path d="M315.3 411.3c-6.253 6.253-16.37 6.253-22.63 0L160 278.6l-132.7 132.7c-6.253 6.253-16.37 6.253-22.63 0c-6.253-6.253-6.253-16.37 0-22.63L137.4 256L4.69 123.3c-6.253-6.253-6.253-16.37 0-22.63c6.253-6.253 16.37-6.253 22.63 0L160 233.4l132.7-132.7c6.253-6.253 16.37-6.253 22.63 0c6.253 6.253 6.253 16.37 0 22.63L182.6 256l132.7 132.7C321.6 394.9 321.6 405.1 315.3 411.3z" />
                    </svg>
                  )}
                </div>
                <div className="stat-value">Tamable</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DinosList;
