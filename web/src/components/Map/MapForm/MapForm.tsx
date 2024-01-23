import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
  useForm,
  useFieldArray,
} from "@redwoodjs/forms";

import type { EditMapById, UpdateMapInput, UpdateMapRegionInput } from "types/graphql";
import type {
  Control,
  FieldValues,
  RWGqlError,
  UseFormRegister,
} from "@redwoodjs/forms";
import Map from "src/components/Util/Map/Map";
import { Input, InputLabel } from "src/components/Util/Input/Input";
import FileUpload from "src/components/Util/FileUpload/FileUpload";
import Alert from "src/components/Util/Alert/Alert";
import Button, { ButtonGroup } from "src/components/Util/Button/Button";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "src/components/Util/Dialog/Dialog";
import { useRef, useState } from "react";
import Table from "src/components/Util/Table/Table";
import MapRegionsCell from "src/components/MapRegion/MapRegionsCell";
import MapResourcesCell from "src/components/MapResource/MapResourcesCell";

type FormMap = NonNullable<EditMapById["map"]>;

interface MapFormProps {
  map?: EditMapById["map"];
  onSave: (data: UpdateMapInput, id?: FormMap["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

interface MapInputProps {
  name: string;
  control: Control<FieldValues>;
  register: UseFormRegister<FieldValues>;
}

const MapForm = (props: MapFormProps) => {
  const { error, loading, map } = props;
  const onSubmit = (data: FormMap) => {
    console.log('MAP GET SUBMITTED', data)
    props.onSave(data, map?.id);
  };

  return (
    <div className="-mt-4 text-sm">
      <Form<FormMap> id="form-map" onSubmit={onSubmit} error={error}>
        <FormError
          error={error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Input
          label="Name"
          name="name"
          color="DEFAULT"
          defaultValue={props.map?.name}
          helperText="Name of this map"
        />

        <br />

        <Input
          label="Description"
          name="description"
          color="DEFAULT"
          multiline
          rows={5}
          defaultValue={props.map?.description}
          helperText="Description of this map"
        />

        <br />

        <Lookup
          label="Parent Map"
          name="parent_map_id"
          helperText="Parent Map, if this map is a child of another map"
          defaultValue={props.map?.parent_map_id}
          getOptionLabel={(val) => val.label}
          isOptionEqualToValue={(val, opt) => val.id === opt.id}
          getOptionValue={(opt) => opt.id}
          options={[
            { label: 'Valguero', id: 1 },
            { label: 'The Island', id: 2 },
            { label: 'The Center', id: 3 },
            { label: 'Ragnarok', id: 4 },
            { label: 'Aberration', id: 4 },
            { label: 'Extinction', id: 6 },
            { label: 'Scorched Earth', id: 7 },
            { label: 'Genesis 1', id: 8 },
            { label: 'Genesis 2', id: 9 },
            { label: 'Crystal Isles', id: 10 },
            { label: 'Fjordur', id: 11 },
            { label: 'Lost Island', id: 12 },
            { label: 'Jotunheim', id: 13 },
            { label: 'Vanaheim', id: 14 },
            { label: 'Asgard', id: 15 },
            { label: 'Midgard', id: 16 },
          ]}
        />

        <br />

        <ButtonGroup>
          <Input
            label="Coordinates Shift Latitude"
            name="cord_shift_lat"
            color="DEFAULT"
            type="number"
            defaultValue={props.map?.cord_shift_lat}
          />
          <Input
            label="Coordinates Shift Longitude"
            name="cord_shift_lon"
            color="DEFAULT"
            type="number"
            defaultValue={props.map?.cord_shift_lon}
          />
        </ButtonGroup>
        <br />

        <ButtonGroup>
          <Input
            label="Coordinates Multiplier Latitude"
            name="cord_mult_lat"
            color="DEFAULT"
            type="number"
            defaultValue={props.map?.cord_mult_lat}
          />
          <Input
            label="Coordinates Multiplier Longitude"
            name="cord_mult_lon"
            color="DEFAULT"
            type="number"
            defaultValue={props.map?.cord_mult_lon}
          />
        </ButtonGroup>

        <Alert variant="outlined" className="w-fit" color="info" title={"Info"}>
          Unsed to calculate coordinates on map
        </Alert>

        <hr role="seperator" className="rw-divider mt-3 w-full fill-white bg-zinc-500 h-px" />

        <Input
          label="Boundaries"
          name="boundaries"
          color="DEFAULT"
          multiline
          rows={5}
          defaultValue={JSON.stringify(props.map?.boundaries, null, 2)}
        />

        <Alert variant="outlined" className="w-fit" color="info" title={"Info"}>
          Boundaries are used to calculate map, when main map has submaps and these submaps go outside main map
        </Alert>
        <br />

        {/* TODO: Add option for topographic map too */}
        <FileUpload
          name="img"
          secondaryName="icon"
          label="Image"
          multiple
          defaultValue={props?.map?.img ? `Map/${props?.map?.img}` : null}
          defaultSecondaryValue={props?.map?.icon ? `Map/${props?.map?.icon}` : null}
          storagePath={`arkimages`}
          valueFormatter={(filename, isUpload) => isUpload ? filename.includes('Map/') ? filename : `Map/${filename}` : filename.includes('Map/') ? filename.replaceAll('Map/', '') : filename}
        />

        <Button
          type="submit"
          variant="contained"
          color="success"
          className="my-3"
          disabled={props.loading}
          startIcon={(
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-4 pointer-events-none"
              fill="currentColor"
            >
              <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
            </svg>
          )}
        >
          Save
        </Button>
      </Form>

      <div className="rw-divide dark:text-white text-black my-3">
        <span>Map Regions</span>
      </div>
      {props?.map?.id && (
        <MapRegionsCell map_id={props?.map?.id} />
      )}

      <div className="rw-divide dark:text-white text-black my-3">
        <span>Map Resources</span>
      </div>
      {props?.map?.id && (
        <MapResourcesCell map_id={props?.map?.id} />
      )}
    </div>
  );
};

export default MapForm;
