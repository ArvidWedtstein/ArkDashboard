import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  Submit,
  NumberField,
  SelectField,
} from "@redwoodjs/forms";

import type {
  EditTimelineBasespotDinoById,
  UpdateTimelineBasespotDinoInput,
} from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, "");
  }
};

type FormTimelineBasespotDino = NonNullable<
  EditTimelineBasespotDinoById["timelineBasespotDino"]
>;

interface TimelineBasespotDinoFormProps {
  timelineBasespotDino?: EditTimelineBasespotDinoById["timelineBasespotDino"];
  onSave: (
    data: UpdateTimelineBasespotDinoInput,
    id?: FormTimelineBasespotDino["id"]
  ) => void;
  id?: string;
  error: RWGqlError;
  loading: boolean;
}

const TimelineBasespotDinoForm = (props: TimelineBasespotDinoFormProps) => {
  const onSubmit = (data: FormTimelineBasespotDino) => {
    props.onSave(data, props?.timelineBasespotDino?.id);
  };

  return (
    <div className="rw-form-wrapper">
      <Form<FormTimelineBasespotDino> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="timelinebasespot_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Timelinebasespot id
        </Label>

        <TextField
          name="timelinebasespot_id"
          defaultValue={
            props.timelineBasespotDino?.timelinebasespot_id || props.id
          }
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="timelinebasespot_id" className="rw-field-error" />

        <fieldset className="rw-form-group">
          <legend>Dino</legend>
          <div>
            <div>
              {/* TODO: Insert dino lookup */}
              <Label
                name="dino_id"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Dino id
              </Label>

              <TextField
                name="dino_id"
                defaultValue={props.timelineBasespotDino?.dino_id}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ required: true }}
              />

              <FieldError name="dino_id" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="name"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Name
              </Label>

              <TextField
                name="name"
                defaultValue={props.timelineBasespotDino?.name}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />

              <FieldError name="name" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="gender"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Gender
              </Label>

              <SelectField
                name="gender"
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                defaultValue={props.timelineBasespotDino?.gender}
                validation={{
                  required: true,
                }}
              >
                <option>N/A</option>
                <option>Male</option>
                <option>Female</option>
              </SelectField>

              <FieldError name="gender" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="birth_date"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Birth date
              </Label>

              <DatetimeLocalField
                name="birth_date"
                defaultValue={formatDatetime(
                  props.timelineBasespotDino?.birth_date
                )}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />

              <FieldError name="birth_date" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="death_date"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Death date
              </Label>

              <DatetimeLocalField
                name="death_date"
                defaultValue={formatDatetime(
                  props.timelineBasespotDino?.death_date
                )}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />

              <FieldError name="death_date" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="death_cause"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Death cause
              </Label>

              <TextField
                name="death_cause"
                defaultValue={props.timelineBasespotDino?.death_cause}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />

              <FieldError name="death_cause" className="rw-field-error" />
            </div>
          </div>
        </fieldset>

        <fieldset className="rw-form-group">
          <legend>Dino Stats</legend>
          <div>
            <div>
              <Label
                name="level_wild"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Level wild/tamed
              </Label>

              <NumberField
                name="level_wild"
                defaultValue={props.timelineBasespotDino?.level_wild || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="level_wild" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="level"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Level
              </Label>

              <NumberField
                name="level"
                defaultValue={props.timelineBasespotDino?.level || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="level" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="wild_health"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Health Wild
              </Label>

              <NumberField
                name="wild_health"
                defaultValue={props.timelineBasespotDino?.wild_health || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="wild_health" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="health"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Health
              </Label>

              <NumberField
                name="health"
                defaultValue={props.timelineBasespotDino?.health || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="health" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="wild_stamina"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Stamina Wild
              </Label>

              <NumberField
                name="wild_stamina"
                defaultValue={props.timelineBasespotDino?.wild_stamina || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="wild_stamina" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="stamina"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Stamina
              </Label>

              <NumberField
                name="stamina"
                defaultValue={props.timelineBasespotDino?.stamina || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="stamina" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="wild_oxygen"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Oxygen Wild
              </Label>

              <NumberField
                name="wild_oxygen"
                defaultValue={props.timelineBasespotDino?.wild_oxygen || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="wild_oxygen" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="oxygen"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Oxygen
              </Label>

              <NumberField
                name="oxygen"
                defaultValue={props.timelineBasespotDino?.oxygen || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="oxygen" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="wild_food"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Food Wild
              </Label>

              <NumberField
                name="wild_food"
                defaultValue={props.timelineBasespotDino?.wild_food || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="wild_food" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="food"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Food
              </Label>

              <NumberField
                name="food"
                defaultValue={props.timelineBasespotDino?.food || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="food" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="wild_weight"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Weight Wild
              </Label>

              <NumberField
                name="wild_weight"
                defaultValue={props.timelineBasespotDino?.wild_weight || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="wild_weight" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="weight"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Weight
              </Label>

              <NumberField
                name="weight"
                defaultValue={props.timelineBasespotDino?.weight || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="weight" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="wild_melee_damage"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Melee damage Wild
              </Label>

              <NumberField
                name="wild_melee_damage"
                defaultValue={
                  props.timelineBasespotDino?.wild_melee_damage || 0
                }
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="wild_melee_damage" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="melee_damage"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Melee damage
              </Label>

              <NumberField
                name="melee_damage"
                defaultValue={props.timelineBasespotDino?.melee_damage || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="melee_damage" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="wild_movement_speed"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Movement speed Wild
              </Label>

              <NumberField
                name="wild_movement_speed"
                defaultValue={
                  props.timelineBasespotDino?.wild_movement_speed || 0
                }
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError
                name="wild_movement_speed"
                className="rw-field-error"
              />
            </div>
            <div>
              <Label
                name="movement_speed"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Movement speed
              </Label>

              <NumberField
                name="movement_speed"
                defaultValue={props.timelineBasespotDino?.movement_speed || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="movement_speed" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="wild_torpor"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Torpor Wild
              </Label>

              <NumberField
                name="wild_torpor"
                defaultValue={props.timelineBasespotDino?.wild_torpor || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="wild_torpor" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="torpor"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Torpor
              </Label>

              <NumberField
                name="torpor"
                defaultValue={props.timelineBasespotDino?.torpor || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="torpor" className="rw-field-error" />
            </div>
          </div>
        </fieldset>

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  );
};

export default TimelineBasespotDinoForm;
