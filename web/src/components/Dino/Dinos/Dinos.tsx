import {
  Link,
  navigate,
  parseSearch,
  routes,
  useParams,
} from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import {
  FieldError,
  Form,
  FormError,
  Label,
  RWGqlError,
  SearchField,
  SelectField,
  Submit,
  TextField,
} from "@redwoodjs/forms";

import { QUERY } from "src/components/Dino/DinosCell";
import type { DeleteDinoMutationVariables, FindDinos } from "types/graphql";
import ImageContainer from "src/components/Util/ImageContainer/ImageContainer";



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
  // const debouncedChangeHandler = useMemo(() => debounce(handlechange, 500), []);
  return (
    <section className="">
      <Form className="my-4 flex w-auto" onSubmit={onSubmit}>
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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {dinosPage.dinos.map((dino) => (
          <Link
            key={`dino-${dino.id}`}
            to={routes.dino({ id: dino.id })}
            className="flex h-auto w-auto max-w-xs flex-row items-start justify-start rounded-md bg-zinc-600 p-4 text-center text-white"
          >
            <div className="flex h-full w-full flex-col items-start justify-between justify-items-stretch">
              <div className="relative mb-3 h-32 w-32 rounded-full border bg-gradient-to-br from-zinc-700 to-zinc-700">
                {/* <ImageContainer
                  loading="lazy"
                  defaultsrc="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/any-hat.png"
                  className="h-auto max-h-full"
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${dino.image}`}
                  onError={(e) => {
                    e.currentTarget.src = `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/any-hat.png`;
                    e.currentTarget.parentElement.hidden = true;
                    e.currentTarget.parentElement.parentElement.classList.replace(
                      "justify-between",
                      "justify-end"
                    );
                  }}
                  // caption={dino.name}
                  // sizes="1rem"
                  // src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/render/image/public/arkimages/dodo.png?width=500&quality=75`}
                  // onLoad={() => console.log(`loaded ${dino.name}`)}
                /> */}
                <img
                  className="h-auto max-h-full"
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${dino.image}`}
                  onError={(e) => {
                    e.currentTarget.src = `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/any-hat.png`;
                    // e.currentTarget.parentElement.hidden = true;
                    e.currentTarget.parentElement.parentElement.classList.replace(
                      "justify-between",
                      "justify-end"
                    );
                  }}
                />
              </div>
              <p className="tracking-wide subpixel-antialiased">{dino.name}</p>
            </div>
            <div className="flex flex-col gap-1">
              {dino.type &&
                dino.type.map((type) => (
                  <img
                    key={`dino-${dino.id}-${type}`}
                    className="w-8"
                    title={type}
                    src={types[type]}
                  />
                ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DinosList;
