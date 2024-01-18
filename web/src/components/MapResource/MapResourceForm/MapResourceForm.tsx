import {
  Form,
  FormError,
} from '@redwoodjs/forms'

import type { EditMapResourceById, FindMapResourcesByMap, UpdateMapResourceInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import { Input } from 'src/components/Util/Input/Input'
import { Lookup } from 'src/components/Util/Lookup/Lookup'
import { ButtonGroup } from 'src/components/Util/Button/Button'

type FormMapResource = NonNullable<EditMapResourceById['mapResource']>

interface MapResourceFormProps {
  mapResource?: EditMapResourceById['mapResource'];
  itemsByCategory: FindMapResourcesByMap["itemsByCategory"];
  onSave: (data: UpdateMapResourceInput, id?: FormMapResource['id']) => void
  error: RWGqlError
  loading: boolean
}

const MapResourceForm = (props: MapResourceFormProps) => {
  const { mapResource, itemsByCategory: { items }, error, loading } = props;
  const onSubmit = (data: FormMapResource) => {
    props.onSave({
      ...data,
      map_id: mapResource?.map_id
    }, mapResource?.id)
  }

  return (
    <Form<FormMapResource> onSubmit={onSubmit} error={error}>
      <FormError
        error={error}
        wrapperClassName="rw-form-error-wrapper"
        titleClassName="rw-form-error-title"
        listClassName="rw-form-error-list"
      />

      <Lookup
        label="Item"
        name="item_id"
        defaultValue={mapResource?.item_id}
        getOptionLabel={({ name }) => name}
        getOptionValue={({ id }) => id}
        getOptionImage={({ image }) => `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
        isOptionEqualToValue={(val, opt) => val.id === opt.id}
        validation={{ required: true }}
        loading={loading}
        options={items}
        InputProps={{
          fullWidth: true
        }}
      />

      <ButtonGroup>
        <Input
          label="Latitude"
          name="latitude"
          color="DEFAULT"
          defaultValue={mapResource?.latitude}
          type="number"
          validation={{ valueAsNumber: true }}
        />
        <Input
          label="Longitude"
          name="longitude"
          color="DEFAULT"
          defaultValue={mapResource?.longitude}
          type="number"
          validation={{ valueAsNumber: true }}
        />
      </ButtonGroup>

      <br />

      <Lookup
        label="Type"
        name="type"
        defaultValue={mapResource?.item_id}
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
          { label: 'Note', id: "note" },
        ]}
      />
    </Form>
  )
}

export default MapResourceForm
