import {
  Form,
  FormError,
  Label,
} from "@redwoodjs/forms";

import type { CreateItemRecipeItemInput, DeleteItemRecipeItemMutationVariables, EditItemRecipeById, NewItemRecipe, UpdateItemRecipeInput, UpdateItemRecipeItemInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import { Input } from "src/components/Util/Input/Input";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import Button, { ButtonGroup } from "src/components/Util/Button/Button";
import { useRef, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "src/components/Util/Dialog/Dialog";
import { ArrayElement } from "src/lib/formatters";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/dist/toast";
import Toast from "src/components/Util/Toast/Toast";
import { QUERY } from "../EditItemRecipeCell";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Badge from "src/components/Util/Badge/Badge";

const REFRESHQUERY = gql`
  query EditItemRecipeByIdWithoutItems($id: BigInt!) {
    itemRecipe: itemRecipe(id: $id) {
      id
      crafted_item_id
      crafting_station_id
      crafting_time
      yields
      required_level
      xp
      skill_quality_multiplier_min
      skill_quality_multiplier_max
      ItemRecipeItem {
        id
        amount
        resource_item_id
      }
    }
  }
`
const CREATE_ITEM_RECIPE_ITEM_MUTATION = gql`
  mutation CreateItemRecipeItemMutation($input: CreateItemRecipeItemInput!) {
    createItemRecipeItem(input: $input) {
      id
    }
  }
`
const UPDATE_ITEM_RECIPE_ITEM_MUTATION = gql`
  mutation UpdateItemRecipeItemMutation(
    $id: BigInt!
    $input: UpdateItemRecipeItemInput!
  ) {
    updateItemRecipeItem(id: $id, input: $input) {
      id
      item_recipe_id
      resource_item_id
      amount
    }
  }
`
const DELETE_ITEM_RECIPE_ITEM_MUTATION = gql`
  mutation DeleteItemRecipeItemMutation($id: BigInt!) {
    deleteItemRecipeItem(id: $id) {
      id
    }
  }
`

type FormItemRecipe = NonNullable<EditItemRecipeById["itemRecipe"]>;

interface ItemRecipeFormProps {
  itemRecipe?: EditItemRecipeById["itemRecipe"];
  onSave: (data: UpdateItemRecipeInput, id?: FormItemRecipe["id"]) => void;
  error: RWGqlError;
  loading: boolean;
  items: NewItemRecipe["items"]
}

const ItemRecipeForm = (props: ItemRecipeFormProps) => {
  const onSubmit = (data: FormItemRecipe) => {
    console.log(data)
    props.onSave({
      ...data,
      crafting_time: parseFloat(data?.crafting_time.toString()) || 0,
      skill_quality_multiplier_min: parseFloat(data?.skill_quality_multiplier_min.toString()) || 0,
      skill_quality_multiplier_max: parseFloat(data?.skill_quality_multiplier_max.toString()) || 0,
      xp: parseFloat(data?.xp.toString()) || 0,
    }, props?.itemRecipe?.id);
  };

  const [createItemRecipeItem, { loading: createLoading, error: createError }] = useMutation(
    CREATE_ITEM_RECIPE_ITEM_MUTATION,
    {
      refetchQueries: [{ query: REFRESHQUERY, variables: { id: props?.itemRecipe?.id }, partialRefetch: true, }],
      awaitRefetchQueries: true,
      onCompleted: () => {
        setOpenModal({ open: false, item_recipe_item: null, edit: null });
      },
      onError: (error) => {
        if (process.env.NODE_ENV !== "production") {
          console.error(error)
        }
        toast.error(error.message)
      },
    }
  )

  const [updateItemRecipeItem, { loading: updateLoading, error: updateError }] = useMutation(
    UPDATE_ITEM_RECIPE_ITEM_MUTATION,
    {
      onCompleted: () => {
        setOpenModal({ open: false, item_recipe_item: null, edit: null });
      },
      onError: (error) => {
        if (process.env.NODE_ENV !== "production") {
          console.error(error)
        }
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateItemRecipeItemInput | UpdateItemRecipeItemInput, id?: FormItemRecipe["id"]) => {
    toast.promise(
      openModal.edit
        ? updateItemRecipeItem({ variables: { id, input } })
        : createItemRecipeItem({ variables: { input } }),
      {
        loading: openModal.edit ? 'Updating ItemRecipeItem...' : 'Creating new ItemRecipeItem...',
        success: `ItemRecipeItem successfully ${openModal.edit ? 'updated' : 'created'}`,
        error: <b>Failed to {openModal.edit ? 'update' : 'create new'} ItemRecipeItem.</b>,
      })
  }

  const [deleteItemRecipeItem] = useMutation(DELETE_ITEM_RECIPE_ITEM_MUTATION, {
    onCompleted: () => {
      toast.success('ItemRecipeItem deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUERY, variables: { id: props?.itemRecipe?.id }, partialRefetch: true, }],
    awaitRefetchQueries: true
  })

  const [openModal, setOpenModal] = useState<{ open: boolean; edit?: boolean, item_recipe_item?: ArrayElement<EditItemRecipeById["itemRecipe"]["ItemRecipeItem"]> }>({
    open: false,
    edit: false,
    item_recipe_item: null
  });

  const modalRef = useRef<HTMLDivElement>();

  type FormItemRecipeItem = NonNullable<{
    __typename?: "ItemRecipeItem";
    id: string;
    amount: number;
    item_id: number;
    item_recipe_id: string;
  }>

  const onSubmitItemRecipeItem = (data: FormItemRecipeItem) => {
    onSave({
      ...data,
      amount: parseInt(data.amount.toString()),
      item_recipe_id: props?.itemRecipe?.id
    }, openModal?.item_recipe_item?.id);
  }

  return (
    <div className="rw-form-wrapper">
      <Dialog ref={modalRef} open={openModal.open} onClose={() => setOpenModal({ open: false, edit: false, item_recipe_item: null })}>
        <DialogTitle>{openModal.edit ? 'Edit' : 'Add'} Item</DialogTitle>
        <DialogContent dividers>
          <div className="rw-form-wrapper">
            <Form<FormItemRecipeItem> onSubmit={onSubmitItemRecipeItem} error={createError || updateError}>
              <FormError
                error={createError || updateError}
                wrapperClassName="rw-form-error-wrapper"
                titleClassName="rw-form-error-title"
                listClassName="rw-form-error-list"
              />

              <Lookup
                label="Item"
                name="resource_item_id"
                loading={props.loading}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                getOptionValue={(opt) => opt.id}
                getOptionLabel={(opt) => opt.name}
                defaultValue={openModal.item_recipe_item?.resource_item_id}
                options={props?.items || []}
                validation={{ required: true }}
              />

              <Input
                label="Amount"
                name="amount"
                defaultValue={openModal.item_recipe_item?.amount}
                validation={{ valueAsNumber: true, required: true, setValueAs: (v) => parseInt(v) }}
                type="number"
              />
            </Form>
          </div>
        </DialogContent>
        <DialogActions className="space-x-1">
          <Button
            type="button"
            color="success"
            variant="contained"
            permission={openModal.edit ? 'gamedata_update' : 'gamedata_create'}
            onClick={() => {
              if (modalRef?.current) {
                modalRef.current.querySelector("form")?.requestSubmit();
              }
            }}
            startIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="pointer-events-none"
                fill="currentColor"
              >
                <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
              </svg>
            }
          >
            {openModal.edit ? 'Save' : 'Add'}
          </Button>
          {openModal.edit && (
            <Button
              type="button"
              color="error"
              variant="contained"
              onClick={() => {
                toast.custom(
                  (t) => (
                    <Toast
                      t={t}
                      title={`You are about to delete itemRecipeItem`}
                      message={`Are you sure you want to delete itemRecipeItem?`}
                      actionType="YesNo"
                      primaryAction={() => deleteItemRecipeItem({ variables: { id: openModal.item_recipe_item.id } })}
                    />
                  ),
                  { position: 'top-center' }
                )

                setOpenModal({ open: false, item_recipe_item: null })
              }}
              startIcon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
                </svg>
              }
            >
              Delete
            </Button>
          )}
          <Button
            type="reset"
            color="error"
            onClick={() => setOpenModal({ open: false, item_recipe_item: null, edit: false })}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Form<FormItemRecipe> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Lookup
          margin="none"
          name="crafted_item_id"
          label={"Item"}
          loading={props.loading}
          isOptionEqualToValue={(opt, val) => opt.id === val.id}
          getOptionValue={(opt) => opt.id}
          getOptionLabel={(opt) => opt.name}
          defaultValue={props.itemRecipe?.crafted_item_id}
          options={props?.items || []}
          validation={{ required: true }}
        />

        <Label
          name="crafting_station_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Crafting Station
        </Label>

        <CheckboxGroup
          defaultValue={props.itemRecipe?.crafting_station_id?.toString()}
          exclusive
          validation={{ valueAsNumber: true }}
          name="crafting_station_id"
          options={[
            {
              value: 606,
              label: "Beer Barrel",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/beer-barrel.webp",
            },
            {
              value: 39,
              label: "Campfire",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/campfire.webp",
            },
            {
              value: 607,
              label: "Chemistry Bench",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/chemistry-bench.webp",
            },
            {
              value: 128,
              label: "Cooking Pot",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/cooking-pot.webp",
            },
            {
              value: 127,
              label: "Compost Bin",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/compost-bin.webp",
            },
            {
              value: 185,
              label: "Fabricator",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/fabricator.webp",
            },
            {
              value: 601,
              label: "Industrial Cooker",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/industrial-cooker.webp",
            },
            {
              value: 600,
              label: "Industrial Forge",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/industrial-forge.webp",
            },
            {
              value: 360,
              label: "Industrial Grill",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/industrial-grill.webp",
            },
            {
              value: 618,
              label: "Industrial Grinder",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/industrial-grinder.webp",
            },
            {
              value: 107,
              label: "Mortar And Pestle",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/mortar-and-pestle.webp",
            },
            {
              value: 125,
              label: "Refining Forge",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/refining-forge.webp",
            },
            {
              value: 126,
              label: "Smithy",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/smithy.webp",
            },
            {
              value: 652,
              label: "Tek Replicator",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/tek-replicator.webp",
            },
            {
              value: 1343,
              label: "Inventory",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/any-craftable-resource.webp",
            },
          ]}
        />

        <ButtonGroup className="my-3">
          <Input
            label="Crafting Time"
            name="crafting_time"
            color="DEFAULT"
            variant="outlined"
            type="number"
            margin="none"
            defaultValue={props.itemRecipe?.crafting_time || 0}
            validation={{ valueAsNumber: true }}
            InputProps={{
              endAdornment: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" shapeRendering="auto" className="w-4 fill-current">
                  <path shapeRendering={"auto"} d="M256 16C247.2 16 240 23.16 240 32v80C240 120.8 247.2 128 256 128s16-7.156 16-16V48.59C379.3 56.81 464 146.7 464 256c0 114.7-93.31 208-208 208S48 370.7 48 256c0-48.84 17.28-96.34 48.66-133.7c5.688-6.75 4.812-16.84-1.969-22.53S77.84 94.94 72.16 101.7C35.94 144.8 16 199.6 16 256c0 132.3 107.7 240 239.1 240S496 388.3 496 256S388.3 16 256 16zM244.7 267.3C247.8 270.4 251.9 272 256 272s8.188-1.562 11.31-4.688c6.25-6.25 6.25-16.38 0-22.62l-80-80c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62L244.7 267.3z" />
                </svg>
              )
            }}
          />
          <Input
            label="Yields"
            name="yields"
            color="DEFAULT"
            variant="outlined"
            margin="none"
            type="number"
            defaultValue={props.itemRecipe?.yields || 1}
            validation={{ valueAsNumber: true, required: true }}
          />
          <Input
            label="Required Level"
            name="required_level"
            color="DEFAULT"
            variant="outlined"
            margin="none"
            type="number"
            defaultValue={props.itemRecipe?.required_level || 0}
            validation={{ valueAsNumber: true }}
            InputProps={{
              endAdornment: 'lvl'
            }}
          />
          <Input
            label="XP"
            name="xp"
            color="DEFAULT"
            variant="outlined"
            margin="none"
            type="text"
            defaultValue={props.itemRecipe?.xp || 0}
            InputProps={{
              inputProps: {
                inputMode: "decimal"
              },
              endAdornment: 'xp'
            }}
          />
        </ButtonGroup>

        <ButtonGroup className="my-3">
          <Input
            label="Skill Quality Multiplier Min"
            name="skill_quality_multiplier_min"
            color="DEFAULT"
            variant="outlined"
            type="text"
            margin="none"
            defaultValue={props.itemRecipe?.skill_quality_multiplier_min || 0}
            validation={{ valueAsNumber: true }}
          />
          <Input
            label="Skill Quality Multiplier Max"
            name="skill_quality_multiplier_max"
            color="DEFAULT"
            variant="outlined"
            margin="none"
            type="text"
            defaultValue={props.itemRecipe?.skill_quality_multiplier_max || 0}
            validation={{ valueAsNumber: true }}
          />
        </ButtonGroup>

        <div className="flex flex-row flex-wrap gap-3 mt-6">
          <TransitionGroup component={null}>
            {props.itemRecipe?.ItemRecipeItem?.map((itemrecipeitem) => {
              const item = props.items.find((item) => item.id === itemrecipeitem.resource_item_id)
              return (
                <CSSTransition
                  key={`recipe-${itemrecipeitem.resource_item_id}`}
                  timeout={500}
                  classNames="item"
                >
                  <Button
                    className="fadetransition aspect-square"
                    variant="outlined"
                    color="DEFAULT"
                    onClick={() => setOpenModal({ open: true, edit: true, item_recipe_item: itemrecipeitem })}
                  >
                    <div className="flex flex-col items-center justify-center w-12 p-1">
                      <img
                        className="h-10 w-10"
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${item.image}`}
                        alt={item.name}
                      />
                      <span className="text-xs">{item.name}</span>
                    </div>
                    <Badge color="DEFAULT" variant="standard" size="small" className="absolute top-0 right-2.5" max={10000000} content={itemrecipeitem.amount} />
                  </Button>
                </CSSTransition>
              )
            })}
          </TransitionGroup>

          {props?.itemRecipe?.id && (
            <Button
              className="aspect-square"
              variant="contained"
              color="success"
              onClick={() => setOpenModal({ open: true })}
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                </svg>
              }
            >
              Add
            </Button>
          )}
        </div>

        <Button
          type="submit"
          color="success"
          variant="outlined"
          disabled={props.loading}
          permission="gamedata_create"
          className="my-3"
          startIcon={(
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className=" pointer-events-none"
              fill="currentColor"
            >
              <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
            </svg>
          )}
        >
          Save
        </Button>
      </Form>
    </div>
  );
};

export default ItemRecipeForm;
