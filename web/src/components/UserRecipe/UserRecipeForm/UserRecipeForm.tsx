import {
  Form,
  FormError,
  FieldError,
  Label,
  DatetimeLocalField,
  TextField,
  CheckboxField,
  Submit,
  SearchField,
  useFieldArray,
  useForm,
} from "@redwoodjs/forms";

import type {
  DeleteUserRecipeItemRecipeMutationVariables,
  EditUserRecipeById,
  UpdateUserRecipeInput,
} from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@apollo/client";
import { toast } from "@redwoodjs/web/dist/toast";
import { debounce, groupBy } from "src/lib/formatters";
import { useMemo, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import ItemList from "src/components/Util/ItemList/ItemList";

const DELETE_USER_RECIPE_ITEM_RECIPE_MUTATION = gql`
  mutation DeleteUserRecipeItemRecipeMutation($id: String!) {
    deleteUserRecipeItemRecipe(id: $id) {
      id
    }
  }
`;
type FormUserRecipe = NonNullable<EditUserRecipeById["userRecipe"]>;

interface UserRecipeFormProps {
  userRecipe?: EditUserRecipeById["userRecipe"];
  itemRecipes?: EditUserRecipeById["itemRecipes"];
  onSave: (data: UpdateUserRecipeInput, id?: FormUserRecipe["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const UserRecipeForm = (props: UserRecipeFormProps) => {
  // const [loadItems, { called, loading, data }] = useLazyQuery(ITEMQUERY, {
  //   variables: { category: "Resource,Consumable" },
  //   onCompleted: (data) => {
  //     console.log(data);
  //     toast.success("Items loaded");
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //     toast.error(error.message);
  //   },
  // });

  const [deleteUserRecipeItemRecipe] = useMutation(
    DELETE_USER_RECIPE_ITEM_RECIPE_MUTATION,
    {
      onCompleted: (data) => {
        console.log(data);
        toast.success("Item Recipe deleted");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const onDeleteClick = (
    id: DeleteUserRecipeItemRecipeMutationVariables["id"]
  ) => {
    if (confirm("Are you sure you want to delete userRecipe " + id + "?")) {
      deleteUserRecipeItemRecipe({ variables: { id } });
    }
  };

  const onSubmit = (data: FormUserRecipe) => {
    props.onSave(data, props?.userRecipe?.id);
  };
  const { register, control } = useForm({
    defaultValues: {
      UserRecipeItemRecipe: props.userRecipe?.UserRecipeItemRecipe || [],
    },
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "UserRecipeItemRecipe", // the name of the field array in your form data
  });

  const [recipes, setRecipes] = useState(props.userRecipe?.UserRecipeItemRecipe || []);
  const handleAddItemRecipe = (itemRecipeId) => {
    console.log(itemRecipeId)
    // setRecipes([...recipes, itemRecipeId]);
  };

  const [search, setSearch] = useState<string>("");
  const categories = useMemo(() => {
    return groupBy(
      (props.itemRecipes || [])
        .map((f) => f.Item_ItemRecipe_crafted_item_idToItem)
        .filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        ),
      "category"
    );
  }, []);
  const categoriesIcons = {
    Armor: "cloth-shirt",
    Tool: "stone-pick",
    Weapon: "assault-rifle",
    Resource: "stone",
    Fertilizer: "fertilizer",
    Structure: "wooden-foundation",
    Other: "any-craftable-resource",
    Consumable: "any-berry-seed",
  };

  return (
    <div className="rw-form-wrapper">
      <Form<FormUserRecipe> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
        <TextField
          name="user_id"
          defaultValue={props.userRecipe?.user_id}
          className="hidden"
          errorClassName="rw-input rw-input-error"
          placeholder=" "
        />
        {!props?.userRecipe?.id && (
          <>
            <Label
              name="user_id"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              User id
            </Label>

            <TextField
              name="user_id"
              defaultValue={props.userRecipe?.user_id}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ required: true }}
            />

            <FieldError name="user_id" className="rw-field-error" />
          </>
        )}

        <div className="rw-input-underline relative max-w-sm rounded-t bg-white bg-opacity-10 p-1">
          <TextField
            name="name"
            defaultValue={props.userRecipe?.name}
            className="border-1 focus:border-pea-600 dark:focus:border-pea-500 peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white"
            errorClassName="rw-input rw-input-error"
            placeholder=" "
          />
          <Label
            name="name"
            className="peer-focus:text-pea-600 peer-focus:dark:text-pea-500 absolute top-4 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-4 peer-focus:-translate-y-4 peer-focus:scale-75 dark:text-gray-400"
            errorClassName="rw-label rw-label-error"
          >
            Name
          </Label>
          <FieldError name="name" className="rw-field-error" />
        </div>

        <Label
          name="private"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Private
        </Label>

        <CheckboxField
          name="private"
          defaultChecked={props.userRecipe?.private}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="private" className="rw-field-error" />

        <div className="flex flex-row gap-3">
          <ItemList options={Object.entries(groupBy(
            (props.itemRecipes || [])
              .map((f) => f.Item_ItemRecipe_crafted_item_idToItem),
            "category"
          )).map(([k, v]) => ({
            label: k,
            value: Object.entries(groupBy(v, "type")).map(([k2, v2]) => ({ label: k2, value: v2.map((itm) => ({ ...itm, label: itm.name, icon: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${itm.image}`, value: [] })), })),
            icon: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${categoriesIcons[k]}.webp`,
          }))} />
          {/* <Form className="relative max-h-screen w-fit max-w-[14rem] overflow-y-auto rounded-lg border border-gray-200 bg-zinc-300 px-3 py-4 text-gray-900 will-change-scroll dark:border-zinc-700 dark:bg-zinc-600 dark:text-white">
            <ul className="relative space-y-2 font-medium">
              <li>
                <Label
                  name="search"
                  className="sr-only mb-2 text-sm text-gray-900 dark:text-white"
                >
                  Search
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                  <SearchField
                    className="rw-input w-full pl-10 dark:bg-zinc-700 dark:focus:bg-zinc-700"
                    name="search"
                    defaultValue={search}
                    placeholder="Search..."
                    inputMode="search"
                    onChange={debounce((e) => {
                      setSearch(e.target.value);
                    }, 300)}
                  />
                </div>
              </li>
              {!props.itemRecipes ||
                (props.itemRecipes.length < 1 && (
                  <li className="flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700">
                    No items found
                  </li>
                ))}
              {Object.entries(categories).map(
                ([category, categoryitems]) => (
                  <li key={category}>
                    <details
                      open={Object.values(categories).length === 1}
                      className="[&>summary:after]:open:rotate-90"
                    >
                      <summary className="flex select-none items-center rounded-lg p-2 text-gray-900 after:absolute after:right-0 after:transform after:px-2 after:transition-transform after:duration-150 after:ease-in-out after:content-['>'] hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700">
                        <img
                          className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 dark:text-gray-400"
                          src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${categoriesIcons[category]}.webp`}
                          alt={``}
                          loading="lazy"
                        />
                        <span className="ml-2">{category}</span>
                      </summary>

                      <ul className="py-2">
                        {Object.values(categoryitems).length === 1 ||
                          categoryitems.every(({ type }) => !type)
                          ? categoryitems.map(({ id, type, image, name }) => (
                            <li key={`${category}-${type}-${id}`}>
                              <button
                                type="button"
                                className="flex w-full items-center rounded-lg p-2 text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700"
                                onClick={() => handleAddItemRecipe(id)}
                              >
                                <img
                                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
                                  alt={name}
                                  className="mr-2 h-5 w-5"
                                  loading="lazy"
                                />
                                {name}
                              </button>
                            </li>
                          ))
                          : Object.entries(groupBy(categoryitems, "type")).map(
                            ([type, typeitems]) => (
                              <li key={`${category}-${type}-${Math.random()}`}>
                                <details className="">
                                  <summary className="flex w-full items-center justify-between rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700">
                                    <span className="">{type}</span>
                                    <span className="text-pea-800 ml-2 inline-flex h-3 w-3 items-center justify-center rounded-full text-xs dark:text-stone-300">
                                      {typeitems.length}
                                    </span>
                                  </summary>

                                  <ul className="py-2">
                                    {typeitems.map((item) => (
                                      <li
                                        key={`${category}-${type}-${item.id}`}
                                      >
                                        <button
                                          type="button"
                                          className="flex w-full items-center rounded-lg p-2 text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700"
                                          onClick={() =>
                                            handleAddItemRecipe(item.id)
                                          }
                                        >
                                          <img
                                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${item.image}`}
                                            alt={item.name}
                                            className="mr-2 h-5 w-5"
                                            loading="lazy"
                                          />
                                          {item.name}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </details>
                              </li>
                            )
                          )}
                      </ul>
                    </details>
                  </li>
                )
              )}
            </ul>
          </Form> */}
          <pre className="text-black dark:text-white">
            {JSON.stringify(props.userRecipe, null, 2)}
          </pre>
          <div className="my-3 flex flex-row flex-wrap gap-2 text-black dark:text-white">
            {props.userRecipe?.UserRecipeItemRecipe?.map(({ id, ItemRecipe }) =>
              ItemRecipe.ItemRecipeItem.map(({ amount, Item }) => (
                <button
                  type="button"
                  className="animate-fade-in b relative rounded-lg border border-zinc-500 p-2 text-center hover:border-red-500 hover:ring-1 hover:ring-red-500"
                  title={Item.name}
                  onClick={() => onDeleteClick(id)}
                  key={`recipe-${Item.id}`}
                >
                  <img
                    className="h-10 w-10"
                    src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${Item.image}`}
                    alt={Item.name}
                  />
                  <div className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-xs font-bold">
                    {amount}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>



        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="rw-button-icon pointer-events-none"
              fill="currentColor"
            >
              <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
            </svg>
          </Submit>
        </div>
      </Form>
    </div>
  );
};

export default UserRecipeForm;
