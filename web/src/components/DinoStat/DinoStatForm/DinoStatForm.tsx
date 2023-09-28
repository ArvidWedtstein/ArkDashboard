import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  RadioField,
  Submit,
} from "@redwoodjs/forms";

import type { EditDinoStatById, UpdateDinoStatInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import { InputOutlined } from "src/components/Util/Input/Input";

type FormDinoStat = NonNullable<EditDinoStatById["dinoStat"]>;

interface DinoStatFormProps {
  dino_id?: FormDinoStat["dino_id"];
  dinoStat?: EditDinoStatById["dinoStat"];
  onSave: (data: UpdateDinoStatInput, id?: FormDinoStat["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const DinoStatForm = (props: DinoStatFormProps) => {
  const onSubmit = (data: FormDinoStat) => {
    props.onSave(data, props?.dinoStat?.id);
  };

  return (
    <div className="rw-form-wrapper">
      <Form<FormDinoStat> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <div className="flex flex-row space-x-3">
          {/* TODO: insert items here */}
          <Lookup
            options={[]}
            name="item_id"
            defaultValue={[props.dinoStat?.item_id.toString()]}
            label="Item"
            validation={{ required: true }}
          />
          <Lookup
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
            defaultValue={[props.dinoStat?.type]}
            closeOnSelect
            label="Type"
          />
        </div>
        <Label
          name="dino_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Dino id
        </Label>

        <TextField
          name="dino_id"
          defaultValue={props?.dinoStat?.dino_id ?? props.dino_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="dino_id" className="rw-field-error" />

        <Label
          name="item_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Item id
        </Label>

        <TextField
          name="item_id"
          defaultValue={props.dinoStat?.item_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="item_id" className="rw-field-error" />

        <Label
          name="value"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Value
        </Label>

        <TextField
          name="value"
          defaultValue={props.dinoStat?.value}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="value" className="rw-field-error" />

        <Label
          name="rank"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Rank
        </Label>

        <TextField
          name="rank"
          defaultValue={props.dinoStat?.rank}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="rank" className="rw-field-error" />

        <Label
          name="type"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Type
        </Label>

        <div className="rw-check-radio-items">
          <RadioField
            id="dinoStat-type-0"
            name="type"
            defaultValue="food"
            defaultChecked={props.dinoStat?.type?.includes("food")}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
          <div>Food</div>
        </div>

        <div className="rw-check-radio-items">
          <RadioField
            id="dinoStat-type-1"
            name="type"
            defaultValue="gather_efficiency"
            defaultChecked={props.dinoStat?.type?.includes("gather_efficiency")}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
          <div>Gather Efficiency</div>
        </div>

        <div className="rw-check-radio-items">
          <RadioField
            id="dinoStat-type-2"
            name="type"
            defaultValue="weight_reduction"
            defaultChecked={props.dinoStat?.type?.includes("weight_reduction")}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
          <div>Weight Reduction</div>
        </div>

        <div className="rw-check-radio-items">
          <RadioField
            id="dinoStat-type-3"
            name="type"
            defaultValue="immobilized_by"
            defaultChecked={props.dinoStat?.type?.includes("immobilized_by")}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
          <div>Immobilized By</div>
        </div>

        <div className="rw-check-radio-items">
          <RadioField
            id="dinoStat-type-4"
            name="type"
            defaultValue="fits_through"
            defaultChecked={props.dinoStat?.type?.includes("fits_through")}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
          <div>Fits Through</div>
        </div>

        <div className="rw-check-radio-items">
          <RadioField
            id="dinoStat-type-5"
            name="type"
            defaultValue="drops"
            defaultChecked={props.dinoStat?.type?.includes("drops")}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
          <div>Drops</div>
        </div>

        <div className="rw-check-radio-items">
          <RadioField
            id="dinoStat-type-6"
            name="type"
            defaultValue="saddle"
            defaultChecked={props.dinoStat?.type?.includes("saddle")}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
          <div>Saddle</div>
        </div>

        <div className="rw-check-radio-items">
          <RadioField
            id="dinoStat-type-7"
            name="type"
            defaultValue="bossrecipe"
            defaultChecked={props.dinoStat?.type?.includes("bossrecipe")}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
          <div>Bossrecipe</div>
        </div>

        <div className="rw-check-radio-items">
          <RadioField
            id="dinoStat-type-8"
            name="type"
            defaultValue="engrams"
            defaultChecked={props.dinoStat?.type?.includes("engrams")}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
          <div>Engrams</div>
        </div>

        <FieldError name="type" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="rw-button-icon-end pointer-events-none"
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

export default DinoStatForm;
