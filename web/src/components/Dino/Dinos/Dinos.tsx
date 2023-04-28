import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import {
  FieldError,
  Form,
  FormError,
  Label,
  RWGqlError,
  SelectField,
  TextField,
} from "@redwoodjs/forms";
import { useEffect, useMemo, useState } from "react";

import { QUERY } from "src/components/Dino/DinosCell";
import debounce from "lodash.debounce";
import type { DeleteDinoMutationVariables, FindDinos } from "types/graphql";
import ImageContainer from "src/components/Util/ImageContainer/ImageContainer";

const DELETE_DINO_MUTATION = gql`
  mutation DeleteDinoMutation($id: String!) {
    deleteDino(id: $id) {
      id
    }
  }
`;

// const DinosList = ({ dinos }: FindDinos) => {
const DinosList = ({ dinosPage }: FindDinos) => {
  const [deleteDino] = useMutation(DELETE_DINO_MUTATION, {
    onCompleted: () => {
      toast.success("Dino deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  });

  const onDeleteClick = (id: DeleteDinoMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete dino " + id + "?")) {
      deleteDino({ variables: { id } });
    }
  };
  // const { dinos } = dinosPage;
  const [dinos, setDinos] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setDinos(dinosPage.dinos);
  }, [dinosPage.dinos]);
  const handlechange = (e) => {
    setSearch(e.target.value);
  };

  // TODO: Replace this search with a GraphQL query
  const handleSelect = (e) => {
    const value = e.target.value;
    if (!value) return setDinos(dinosPage.dinos);
    setDinos(
      dinosPage.dinos.filter((d) => (d.type ? d.type.includes(value) : ""))
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
  const debouncedChangeHandler = useMemo(() => debounce(handlechange, 500), []);
  return (
    <section className="">
      <Form className="my-4 flex">
        <label htmlFor="category" className="sr-only">
          Choose a category
        </label>
        <SelectField
          name="category"
          className="rw-input z-10 inline-flex flex-shrink-0 items-center rounded-none rounded-l-lg"
          onChange={handleSelect}
          defaultValue={"default"}
        >
          <option value="default">Choose a category</option>
          <option value="boss">Boss</option>
          <option value="flyer">Flyer</option>
          <option value="water">Water</option>
          <option value="amphibious">Amphibious</option>
          <option value="ground">Ground</option>
        </SelectField>

        <label htmlFor="dino" className="sr-only">
          Search for dino
        </label>

        <TextField
          name="dino"
          className="rw-input w-full rounded-none !rounded-r-lg"
          placeholder="Search for dino"
          onInput={(event) => {
            debouncedChangeHandler(event);
          }}
        />
      </Form>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {dinos
          .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
          .map((dino) => (
            <Link
              key={`dino-${dino.id}`}
              to={routes.dino({ id: dino.id })}
              className="flex h-auto w-auto max-w-xs flex-row items-start justify-start rounded-md bg-zinc-600 p-4 text-center text-white"
            >
              <div className="flex h-full w-full flex-col items-start justify-between justify-items-stretch">
                <div className="relative mb-6 h-32 w-32 rounded-full border bg-gradient-to-br from-zinc-700 to-zinc-700">
                  <ImageContainer
                    className="h-auto max-h-full"
                    src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${dino.image}`}
                    onError={(e) => {
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
                  />
                  {/* <img
                    className="h-auto max-h-full"
                    src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${dino.image}`}
                    onError={(e) => {
                      e.currentTarget.parentElement.hidden = true;
                      e.currentTarget.parentElement.parentElement.classList.replace(
                        "justify-between",
                        "justify-end"
                      );
                    }}

                  /> */}
                </div>
                <p className="tracking-wide subpixel-antialiased">
                  {dino.name}
                </p>
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
