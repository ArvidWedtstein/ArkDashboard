import { useLazyQuery } from "@apollo/client";
import { Form, Label, SearchField, SelectField, Submit } from "@redwoodjs/forms";
import { Link, Redirect, routes, navigate, parseSearch, useParams } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import ArkCard from "src/components/ArkCard/ArkCard";

import { QUERY } from "src/components/Item/ItemsCell";
import { groupBy } from "src/lib/formatters";

import type { DeleteItemMutationVariables, FindItems } from "types/graphql";

const DELETE_ITEM_MUTATION = gql`
  mutation DeleteItemMutation($id: BigInt!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

const ItemsList = ({ itemsPage }: FindItems) => {
  // const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
  //   onCompleted: () => {
  //     toast.success("Item deleted");
  //   },
  //   onError: (error) => {
  //     toast.error(error.message);
  //   },
  //   // This refetches the query on the list page. Read more about other ways to
  //   // update the cache over here:
  //   // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
  //   refetchQueries: [{ query: QUERY }],
  //   awaitRefetchQueries: true,
  // });



  // const onDeleteClick = (id: DeleteItemMutationVariables["id"]) => {
  //   if (confirm("Are you sure you want to delete item " + id + "?")) {
  //     deleteItem({ variables: { id } });
  //   }
  // };
  let { search, category, type } = useParams();
  const onSubmit = ((e) => {
    navigate(routes.items(parseSearch(e)))
  })
  const [view, setView] = useState("grid");
  // const groupedItems = useMemo(() => groupBy(itemsPage.items, "category"), [itemsPage.items])
  return (
    <div className="rw-segment overflow-hidden">
      <Form className="w-auto" onSubmit={onSubmit}>
        <nav className="flex flex-row space-x-2 justify-center">
          <div className="rw-button-group !space-x-0 w-full">
            <Label name="category" className="sr-only">
              Choose a category
            </Label>
            <SelectField
              name="category"
              className="rw-input !rounded-l-lg mt-0"
              defaultValue={category}
              validation={{
                required: false,
                shouldUnregister: true,
                validate: {
                  matchesInitialValue: (value) => {
                    return (
                      value !== 'Choose a category' ||
                      'Select an Option'
                    )
                  },
                },
              }}
            >
              <option value="">Choose a category</option>
              <option value="resource">Resources</option>
              <option value="structure">Structures</option>
              <option value="armor">Armor</option>
              <option value="weapon">Weapons</option>
              <option value="consumable">Consumable</option>
              <option value="tool">Tools</option>
              <option value="other">Other</option>
            </SelectField>
            <SelectField
              name="type"
              className="rw-input mt-0"
              defaultValue={type}
              validation={{
                deps: ['category'],
                required: false,
                shouldUnregister: true,
                validate: {
                  matchesInitialValue: (value) => {
                    return (
                      value !== 'Choose a type' ||
                      'Select an Option'
                    )
                  },
                },
              }}
            >
              <option value="">Choose a type</option>
              <optgroup label="Structure" disabled color="red">
                <option value="tek">Tek</option>
                <option value="building">Building</option>
                <option value="crafting">Crafting</option>
                <option value="electrical">Electrical</option>
              </optgroup>
              <optgroup label="Armor">
                <option value="tek">Tek</option>
                <option value="riot">Riot</option>
                <option value="flak">Flak</option>
                <option value="hazard">Hazard</option>
                <option value="scuba">Scuba</option>
                <option value="fur">Fur</option>
                <option value="ghillie">Ghillie</option>
                <option value="chitin">Chitin</option>
                <option value="desert">Desert</option>
                <option value="hide">Hide</option>
                <option value="cloth">Cloth</option>
                <option value="saddle">Saddles</option>
                <option value="attachment">Attachment</option>
              </optgroup>
              <optgroup label="Weapons">
                <option value="explosive">Explosive</option>
                <option value="ammunition">Ammunition</option>
                <option value="arrow">Arrow</option>
                <option value="tool">Tools</option>
                <option value="attachment">Attachment</option>
                <option value="shield">Shields</option>
              </optgroup>
              <optgroup label="Resources">

              </optgroup>
              <optgroup label="Consumables">
                <option value="egg">Egg</option>
              </optgroup>
              <option value="resource">Resources</option>
              <option value="tool">Tools</option>
              <optgroup label="Other">
                <option value="navigation">Navigation</option>
                <option value="coloring">Coloring</option>
                <option value="artifact">Artifacts</option>
                <option value="null">Other</option>

              </optgroup>
            </SelectField>
            <SearchField
              name="search"
              className="rw-input mt-0 w-full"
              placeholder="Search..."
              defaultValue={search}
            />
            <Submit className="rw-button rw-button-gray rounded-l-none">
              Search
            </Submit>
          </div>
          <div className="rw-button-group">
            <input
              type="radio"
              id="list"
              name="view"
              value="list"
              className="peer/list hidden"
              checked={view === "list"}
              onChange={() => setView("list")}
            />
            <label
              htmlFor="list"
              className="rw-button rw-button-gray peer-checked/list:border-pea-500 border"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-5 w-5 fill-current"
              >
                <path d="M64 48H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 62.33 81.67 48 64 48zM64 112H32v-32h32V112zM64 368H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 382.3 81.67 368 64 368zM64 432H32v-32h32V432zM176 112h320c8.801 0 16-7.201 16-15.1C512 87.2 504.8 80 496 80h-320C167.2 80 160 87.2 160 95.1C160 104.8 167.2 112 176 112zM496 240h-320C167.2 240 160 247.2 160 256c0 8.799 7.201 16 16 16h320C504.8 272 512 264.8 512 256C512 247.2 504.8 240 496 240zM496 400h-320C167.2 400 160 407.2 160 416c0 8.799 7.201 16 16 16h320c8.801 0 16-7.201 16-16C512 407.2 504.8 400 496 400zM64 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32C96 222.3 81.67 208 64 208zM64 272H32v-32h32V272z" />
              </svg>
            </label>
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
              htmlFor="grid"
              className="rw-button rw-button-gray peer-checked/grid:border-pea-500 border"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-5 w-5 fill-current"
              >
                <path d="M160 0H64C28.65 0 0 28.65 0 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64V64C224 28.65 195.3 0 160 0zM192 160c0 17.64-14.36 32-32 32H64C46.36 192 32 177.6 32 160V64c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V160zM160 288H64c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64v-96C224 316.7 195.3 288 160 288zM192 448c0 17.64-14.36 32-32 32H64c-17.64 0-32-14.36-32-32v-96c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V448zM448 0h-96c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64V64C512 28.65 483.3 0 448 0zM480 160c0 17.64-14.36 32-32 32h-96c-17.64 0-32-14.36-32-32V64c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V160zM448 288h-96c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h96c35.35 0 64-28.65 64-64v-96C512 316.7 483.3 288 448 288zM480 448c0 17.64-14.36 32-32 32h-96c-17.64 0-32-14.36-32-32v-96c0-17.64 14.36-32 32-32h96c17.64 0 32 14.36 32 32V448z" />
              </svg>
            </label>
          </div>
        </nav>
      </Form>
      <div
        className={clsx("grid gap-4 overflow-y-hidden", {
          "grid-cols-1": view === "list",
          "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6":
            view === "grid",
        })}
      >
        {/* {Object.entries(groupedItems).map(([key, items], i) => (
          <details key={`item-${i}`} className="border border-gray-800 dark:border-gray-500 text-white">
            <summary>{key}</summary>
            {items.map((item, i) => (
              <Link to={routes.item({ id: item.id.toString() })} key={`item-${i}`}>
                <ArkCard
                  className="border border-gray-800 dark:border-gray-500 " // bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-500 to-zinc-900
                  title={item.name}
                  subtitle={item.type}
                  content={view === "list" ? item.description : ""}
                  icon={{
                    src: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${item.image}`,
                    alt: `${item.name}`,
                  }}
                />
              </Link>
            ))}
          </details>
        ))} */}
        {itemsPage.items.map((item, i) => (
          <Link to={routes.item({ id: item.id.toString() })} key={`item-${i}`}>
            <ArkCard
              className="border border-gray-800 dark:border-gray-500 " // bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-500 to-zinc-900
              title={item.name}
              subtitle={item.type}
              content={view === "list" ? item.description : ""}
              icon={{
                src: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${item.image}`,
                alt: `${item.name}`,
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ItemsList;
