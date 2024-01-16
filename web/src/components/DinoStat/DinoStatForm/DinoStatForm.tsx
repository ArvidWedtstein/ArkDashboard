import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from "@redwoodjs/forms";

import type { EditDinoStatById, NewDinoStat, UpdateDinoStatInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import { Input } from "src/components/Util/Input/Input";
import Button from "src/components/Util/Button/Button";

type FormDinoStat = NonNullable<EditDinoStatById["dinoStat"]>;

// highlight-start
interface DinoStatFormProps {
  dinoStat?: EditDinoStatById["dinoStat"];
  itemsByCategory?: NewDinoStat["itemsByCategory"];
  dino_id?: string;
  onSave: (data: UpdateDinoStatInput, id?: FormDinoStat["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const DinoStatForm = (props: DinoStatFormProps) => {
  const onSubmit = (data: FormDinoStat) => {
    props.onSave(data, props?.dinoStat?.id);
  };


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
            margin="none"
            options={props?.itemsByCategory.items}
            name="item_id"
            defaultValue={props.dinoStat?.item_id}
            getOptionValue={(opt) => opt.id}
            getOptionLabel={(opt) => opt.name}
            getOptionImage={(opt) => `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${opt.image}`}
            label="Item"
            validation={{ required: true }}
          />
          <Lookup
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
            ]}
            name="type"
            defaultValue={props.dinoStat?.type}
            closeOnSelect
            label="Type"
          />

          <Input
            label="Value"
            name="value"
            type="number"
            defaultValue={props.dinoStat?.value}
            margin="none"
            validation={{ valueAsNumber: true }}
          />
        </div>


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
