import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

import type { EditMapResourceById, UpdateMapResourceInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import { Input } from 'src/components/Util/Input/Input'
import { Lookup } from 'src/components/Util/Lookup/Lookup'
import Button from 'src/components/Util/Button/Button'

type FormMapResource = NonNullable<EditMapResourceById['mapResource']>

interface MapResourceFormProps {
  mapResource?: EditMapResourceById['mapResource']
  onSave: (data: UpdateMapResourceInput, id?: FormMapResource['id']) => void
  error: RWGqlError
  loading: boolean
}

const MapResourceForm = (props: MapResourceFormProps) => {
  const onSubmit = (data: FormMapResource) => {
    props.onSave(data, props?.mapResource?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormMapResource> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        {/* TODO: insert map id from db */}
        <Lookup
          label="Map"
          name="map_id"
          defaultValue={props.mapResource?.map_id}
          getOptionLabel={(val) => val.label}
          isOptionEqualToValue={(val, opt) => val.id === opt.id}
          validation={{ required: true }}
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

        {/* TODO: insert items from db */}
        <Lookup
          label="Item"
          name="item_id"
          defaultValue={props.mapResource?.item_id}
          getOptionLabel={(val) => val.label}
          isOptionEqualToValue={(val, opt) => val.id === opt.id}
          // getOptionValue={(opt) => opt.id}
          validation={{ required: true }}
          options={[

          ]}
        />

        <Input
          label="Latitude"
          name="latitude"
          color="DEFAULT"
          defaultValue={props.mapResource?.latitude}
          type="number"
          validation={{ valueAsNumber: true }}
          SuffixProps={{
            style: {
              borderRadius: "0.375rem 0 0 0.375rem",
              marginRight: '-0.5px'
            }
          }}
        />
        <Input
          label="Longitude"
          name="longitude"
          color="DEFAULT"
          defaultValue={props.mapResource?.longitude}
          type="number"
          validation={{ valueAsNumber: true }}
          SuffixProps={{
            style: {
              borderRadius: "0 0.375rem 0.375rem 0",
              marginLeft: '-0.5px'
            }
          }}
        />

        <br />
        <Lookup
          label="Type"
          name="type"
          defaultValue={props.mapResource?.item_id}
          getOptionLabel={(val) => val.label}
          isOptionEqualToValue={(val, opt) => val.id === opt.id}
          getOptionValue={(opt) => opt.id}
          options={[
            { label: 'Deinonychus Nest', id: "deinonychus_nest" },
            { label: 'Wyvern Nest', id: "wyvern_nest" },
            { label: 'Ice Wyvern Nest', id: "ice_wyvern_nest" },
            { label: 'Charge Node', id: "charge_node" },
            { label: 'Drake Nest', id: "drake_nest" },
            { label: 'Glitch', id: "glitch" },
            { label: 'Gas Vein', id: "gas_vein" },
            { label: 'Water Vein', id: "water_vein" },
            { label: 'Drake Nest', id: "drake_nest" },
            { label: 'Plant Z Node', id: "plant_z_node" },
            { label: 'Magmasaur Nest', id: "magmasaur_nest" },
          ]}
        />

        <div className="rw-button-group">
          <Button
            type="submit"
            variant="outlined"
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
  )
}

export default MapResourceForm
