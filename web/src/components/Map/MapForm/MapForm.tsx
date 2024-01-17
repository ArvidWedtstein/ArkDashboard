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
import Button from "src/components/Util/Button/Button";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "src/components/Util/Dialog/Dialog";
import { useRef, useState } from "react";

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
  const { error, loading } = props;
  const onSubmit = (data: FormMap) => {
    props.onSave(data, props?.map?.id);
  };

  const [openModal, setOpenModal] = useState<{
    open: boolean;
  }>({ open: false });

  const modalRef = useRef<HTMLDivElement>();
  return (
    <div className="rw-form-wrapper">
      <Dialog ref={modalRef} open={openModal.open} onClose={() => setOpenModal({ open: false })}>
        <DialogTitle>
          New Map Region
        </DialogTitle>
        <DialogContent dividers>
          <Form<NonNullable<UpdateMapRegionInput>> onSubmit={(data) => console.log(data)} error={error} className="rw-form-wrapper my-3">
            <FormError
              error={props.error}
              wrapperClassName="rw-form-error-wrapper"
              titleClassName="rw-form-error-title"
              listClassName="rw-form-error-list"
            />

            <div className="flex flex-row space-x-3">
              {/* <Lookup
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
                defaultValue={openModal?.dino_stat?.type}
                closeOnSelect
              />

              {!["immobilized_by", "fits_through", "saddle", "food"].includes(selectedType) && (
                <Input
                  label="Value"
                  name="value"
                  type="number"
                  defaultValue={openModal?.dino_stat?.value}
                  margin="none"
                  validation={{ valueAsNumber: true }}
                />
              )} */}
            </div>
          </Form>
        </DialogContent>
        <DialogActions className="space-x-1">
          <Button
            type="button"
            color="success"
            variant="contained"
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
            Save
          </Button>
          <Button
            type="reset"
            color="error"
            onClick={() => setOpenModal({ open: false })}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Form<FormMap> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
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
        <Input
          label="Coordinates Shift Latitude"
          name="cord_shift_lat"
          color="DEFAULT"
          type="number"
          defaultValue={props.map?.cord_shift_lat}
          SuffixProps={{
            style: {
              borderRadius: "0.375rem 0 0 0.375rem",
              marginRight: '-0.5px'
            }
          }}
        />
        <Input
          label="Coordinates Shift Longitude"
          name="cord_shift_lon"
          color="DEFAULT"
          type="number"
          defaultValue={props.map?.cord_shift_lon}
          SuffixProps={{
            style: {
              borderRadius: "0 0.375rem 0.375rem 0",
              marginLeft: '-0.5px'
            }
          }}
        />
        <br />
        <Input
          label="Coordinates Multiplier Latitude"
          name="cord_mult_lat"
          color="DEFAULT"
          type="number"
          defaultValue={props.map?.cord_mult_lat}
          SuffixProps={{
            style: {
              borderRadius: "0.375rem 0 0 0.375rem",
              marginRight: '-0.5px'
            }
          }}
        />
        <Input
          label="Coordinates Multiplier Longitude"
          name="cord_mult_lon"
          color="DEFAULT"
          type="number"
          defaultValue={props.map?.cord_mult_lon}
          SuffixProps={{
            style: {
              borderRadius: "0 0.375rem 0.375rem 0",
              marginLeft: '-0.5px'
            }
          }}
        />
        <Alert variant="outlined" className="w-fit" severity="info" title={"Info"}>
          Unsed to calculate coordinates on map
        </Alert>

        <hr className="rw-divider mt-3 w-full fill-white bg-zinc-500 h-px" />

        <Input
          label="Boundaries"
          name="boundaries"
          color="DEFAULT"
          multiline
          rows={5}
          defaultValue={JSON.stringify(props.map?.boundaries, null, 2)}
        />
        <Alert variant="outlined" className="w-fit" severity="info" title={"Info"}>
          Boundaries are used to calculate map, when main map has submaps and these submaps go outside main map
        </Alert>
        <br />

        {/* TODO: Add option for topographic map too */}
        <FileUpload
          name="image"
          secondaryName="icon"
          label="Image"
          multiple
          defaultValue={props?.map?.img ? `Map/${props?.map?.img}` : null}
          defaultSecondaryValue={props?.map?.icon ? `Map/${props?.map?.icon}` : null}
          storagePath={`arkimages`}
        />

        {/* TODO: add mapregion and mapresources here */}


        {/* TODO: mapregions. use Table component i guess? */}
        <div className="mt-3 table table-auto rounded-lg max-w-2xl border border-zinc-500 border-opacity-70 p-2 text-left">
          <div className="table-header-group w-full text-xs text-black dark:text-zinc-300">
            <div className="table-cell p-2">Region</div>
            <div className="table-cell w-1/5 p-2">Value</div>
            <div className="table-cell p-2">Type</div>
            <div className="table-cell p-2">Action</div>
          </div>
          {/* {props?.dino?.DinoStat.map((dinoStat) => {
                  return (
                    <div className={`table-row-group w-full text-xs text-black dark:text-white`}>
                      <div className="table-cell w-2/5 p-2">{dinoStat.Item.name}</div>
                      <div className="table-cell p-2">
                        {dinoStat.value}
                      </div>
                      <div className="table-cell truncate p-2">
                        {dinoStat.type}
                      </div>
                      <div className="table-cell align-middle relative">
                        <Button
                          permission="gamedata_update"
                          color="primary"
                          variant="outlined"
                          size="small"
                          onClick={() => setOpenModal({ open: true, dino_stat: dinoStat })}
                          startIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                              <path d="M493.2 56.26l-37.51-37.51C443.2 6.252 426.8 0 410.5 0c-16.38 0-32.76 6.25-45.26 18.75L45.11 338.9c-8.568 8.566-14.53 19.39-17.18 31.21l-27.61 122.8C-1.7 502.1 6.158 512 15.95 512c1.047 0 2.116-.1034 3.198-.3202c0 0 84.61-17.95 122.8-26.93c11.54-2.717 21.87-8.523 30.25-16.9l321.2-321.2C518.3 121.7 518.2 81.26 493.2 56.26zM149.5 445.2c-4.219 4.219-9.252 7.039-14.96 8.383c-24.68 5.811-69.64 15.55-97.46 21.52l22.04-98.01c1.332-5.918 4.303-11.31 8.594-15.6l247.6-247.6l82.76 82.76L149.5 445.2zM470.7 124l-50.03 50.02l-82.76-82.76l49.93-49.93C393.9 35.33 401.9 32 410.5 32s16.58 3.33 22.63 9.375l37.51 37.51C483.1 91.37 483.1 111.6 470.7 124z" />
                            </svg>
                          }
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  )
                })} */}
          <div className={`table-row-group w-full text-xs text-black dark:text-white`}>
            <div className="table-cell w-2/5 p-2">-</div>
            <div className="table-cell p-2">
              -
            </div>
            <div className="table-cell truncate p-2">
              -
            </div>
            <div className="table-cell align-middle relative">
              <Button
                permission="gamedata_update"
                color="primary"
                variant="outlined"
                size="small"
                onClick={() => setOpenModal({ open: true })}
              >
                New
              </Button>
            </div>
          </div>
        </div>

        <div className="rw-button-group">
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={props.loading}
            endIcon={(
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
        </div>
      </Form>
    </div>
  );
};

export default MapForm;
