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
        <nav className="flex w-full flex-row justify-center rw-button-group">
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
          <div className="relative w-full">
            <Label name="search" className="sr-only">
              Search for dino
            </Label>
            <SearchField
              name="search"
              className="rw-input mt-0 !w-full !rounded-r-lg !rounded-l-none"
              placeholder="Search for a dinosaur..."
              defaultValue={search}
            />
            <Submit className="absolute top-0 right-0 h-full rw-button rw-button-blue rounded-l-none">
              <span className="hidden md:block">Search</span>
              <svg className="rw-button-icon-end !fill-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </Submit>
          </div>
        </nav>
      </Form>

      <div className="3xl:grid-cols-6 grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {(dinosPage.count === 0 || dinosPage.dinos.length == 0) && (
          <div className="col-span-full">
            <div className="rw-text-center">
              <p>No dinos found with that name</p>
            </div>
          </div>
        )}
        {dinosPage.dinos.map(
          ({ id, name, type, image, description, tamable, temperament }) => (
            <Link
              to={routes.dino({ id: id })}
              className="relative flex h-full flex-1 flex-col overflow-hidden rounded-lg border border-black bg-white text-center dark:border-zinc-500"
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
                      src={types[type]}
                    />
                  ))}
              </div>
            </Link>
          )
        )}
      </div>
    </section>
  );
};

export default DinosList;