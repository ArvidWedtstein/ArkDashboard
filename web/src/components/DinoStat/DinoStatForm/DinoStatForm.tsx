import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
} from "@redwoodjs/forms";

import type { DinoStat, EditDinoById, FindItemsByCategory, UpdateDinoStatInput, dinostattype } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import { Input } from "src/components/Util/Input/Input";
import { Fragment, useState } from "react";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import { ArrayElement } from "src/lib/formatters";

type FormDinoStat = NonNullable<UpdateDinoStatInput>;

interface DinoStatFormProps {
  dinoStat?: ArrayElement<EditDinoById["dino"]["DinoStat"]>;
  itemsByCategory?: FindItemsByCategory["itemsByCategory"];
  dino_id?: string;
  onSave: (data: UpdateDinoStatInput, id?: ArrayElement<EditDinoById["dino"]["DinoStat"]>["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const DinoStatForm = (props: DinoStatFormProps) => {
  const onSubmit = (data: FormDinoStat) => {
    props.onSave(data, props?.dinoStat?.id);
  };

  const [selectedType, setSelectedType] = useState<dinostattype>(null);
  const checkTypes = {
    "immobilized_by": [
      {
        value: "733",
        label: "Lasso",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/lasso.webp",
      },
      {
        value: "1040",
        label: "Bola",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/bola.webp",
      },
      {
        value: "725",
        label: "Chain Bola",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/chain-bola.webp",
      },
      {
        value: "785",
        label: "Net Projectile",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/net-projectile.webp",
      },
      {
        value: "1252",
        label: "Plant Species Y Trap",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/plant-species-y-trap.webp",
      },
      {
        value: "383",
        label: "Bear Trap",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/bear-trap.webp",
      },
      {
        value: "384",
        label: "Large Bear Trap",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/large-bear-trap.webp",
      },
    ],
    "fits_through": [
      {
        value: "322",
        label: "Doorframe",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-doorframe.webp",
      },
      {
        value: 1066,
        label: "Double Doorframe",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-double-doorframe.webp",
      },
      {
        value: "143",
        label: "Dinosaur Gateway",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-dinosaur-gateway.webp",
      },
      {
        value: "381",
        label: "Behemoth Dino Gateway",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/behemoth-stone-dinosaur-gateway.webp",
      },
      {
        value: "316",
        label: "Hatchframe",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-hatchframe.webp",
      },
      {
        value: "619",
        label: "Giant Hatchframe",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/giant-stone-hatchframe.webp",
      },
    ]
  }

  return (
    <div className="rw-form-wrapper my-3">
      <Form<FormDinoStat> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <div className="flex flex-row space-x-3">
          <Lookup
            label="Type"
            margin="none"
            isOptionEqualToValue={(option, value) => option.value === value.value}
            getOptionLabel={(option) => option.label}
            getOptionValue={(opt) => opt.value}
            options={[
              { value: "food", label: "Food" },
              { value: "gather_efficiency", label: "Gather Efficiency" },
              { value: "weight_reduction", label: "Weight Reduction" },
              { value: "immobilized_by", label: "Immobilized By" },
              { value: "fits_through", label: "Fits Through" },
              { value: "drops", label: "Drops" },
              { value: "saddle", label: "Saddle" },
              { value: "bossrecipe", label: "Bossrecipe" },
              { value: "engrams", label: "Engrams" },
            ] as { value: dinostattype, label: string }[]}
            onSelect={(e) => {
              setSelectedType(e.value)
            }}
            name="type"
            defaultValue={props.dinoStat?.type}
            closeOnSelect
          />

          {!["immobilized_by", "fits_through"].includes(selectedType) && (
            <Input
              label="Value"
              name="value"
              type="number"
              defaultValue={props.dinoStat?.value}
              margin="none"
              validation={{ valueAsNumber: true }}
            />
          )}
        </div>


        {["immobilized_by", "fits_through"].includes(selectedType) ? (
          <Fragment>
            <Label
              name="item_id"
              className="rw-label capitalize"
              errorClassName="rw-label rw-label-error"
            >
              {selectedType.replaceAll('_', ' ')}
            </Label>

            <CheckboxGroup
              name="item_id"
              defaultValue={props.dinoStat?.item_id?.toString()}
              exclusive
              options={checkTypes[selectedType]}
            />

            <FieldError name="item_id" className="rw-field-error" />
          </Fragment>
        ) : (
          <Lookup
            margin="none"
            label="Item"
            options={props?.itemsByCategory.items.filter((c) => c.type === (selectedType === 'saddle' ? 'Saddle' : ''))}
            name="item_id"
            defaultValue={props.dinoStat?.item_id}
            getOptionValue={(opt) => opt.id}
            getOptionLabel={(opt) => opt.name}
            getOptionImage={(opt) => `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${opt.image}`}
            validation={{ required: true }}
          />
        )}


        <TextField
          name="dino_id"
          defaultValue={props?.dinoStat?.dino_id || props?.dino_id}
          className="rw-input hidden"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
      </Form>
    </div>
  );
};

export default DinoStatForm;
