import {
  Form,
  FormError,
} from '@redwoodjs/forms'

import type { FindMapRegionsByMap, UpdateMapRegionInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import Button, { ButtonGroup } from 'src/components/Util/Button/Button'
import { Input } from 'src/components/Util/Input/Input'
import Switch from 'src/components/Util/Switch/Switch'
import Alert from 'src/components/Util/Alert/Alert'
import { forwardRef } from 'react'
import { ArrayElement } from 'src/lib/formatters'

type FormMapRegion = NonNullable<ArrayElement<FindMapRegionsByMap["mapRegionsByMap"]>>

interface MapRegionFormProps {
  mapRegion?: ArrayElement<FindMapRegionsByMap["mapRegionsByMap"]>
  onSave: (data: UpdateMapRegionInput, id?: FormMapRegion['id']) => void
  error: RWGqlError
  loading: boolean
}

const MapRegionForm = forwardRef<HTMLFormElement, MapRegionFormProps>((props, ref) => {
  const onSubmit = (data: FormMapRegion) => {
    props.onSave({
      ...data,
      map_id: props?.mapRegion?.map_id,
      temperature: parseFloat(data?.temperature?.toString()),
      wind: parseFloat(data?.wind?.toString()),
    }, props?.mapRegion?.id)
  }

  return (
    <Form<FormMapRegion> onSubmit={onSubmit} id="form-map-region" ref={ref} error={props.error}>
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
        variant='outlined'
        defaultValue={props.mapRegion?.name}
      />

      <br />

      <ButtonGroup>
        <Input
          label="Wind"
          name="wind"
          color="DEFAULT"
          variant='outlined'
          type="number"
          defaultValue={props.mapRegion?.wind || 0}
          validation={{ valueAsNumber: true, setValueAs: (e) => parseFloat(e) }}
          InputProps={{
            endAdornment: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='w-4 fill-current'>
                <path d="M16 192h352C412.1 192 448 156.1 448 112S412.1 32 368 32h-32C327.2 32 320 39.16 320 48S327.2 64 336 64h32C394.5 64 416 85.53 416 112S394.5 160 368 160h-352C7.156 160 0 167.2 0 176S7.156 192 16 192zM176 320h-160C7.156 320 0 327.2 0 336S7.156 352 16 352h160C202.5 352 224 373.5 224 400S202.5 448 176 448h-32C135.2 448 128 455.2 128 464S135.2 480 144 480h32c44.13 0 80-35.88 80-80S220.1 320 176 320zM424 240H16C7.156 240 0 247.2 0 256s7.156 16 16 16h408c30.88 0 56 25.12 56 56S454.9 384 424 384H400c-8.844 0-16 7.156-16 16s7.156 16 16 16h24c48.53 0 88-39.47 88-88S472.5 240 424 240z" />
              </svg>
            )
          }}
        />
        <Input
          label="Temperature"
          name="temperature"
          color="DEFAULT"
          variant='outlined'
          type="number"
          defaultValue={props.mapRegion?.temperature || 0}
          validation={{ valueAsNumber: true }}
          InputProps={{
            endAdornment: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className='w-4 fill-current'>
                <path d="M256 96c0-53-43-95.1-96-95.1S64 43 64 96v203.4c-19.75 22.38-31.87 51.75-31.1 84C31.63 453.6 88.75 511.5 159.1 512l.8743 .0001C230.7 512 288 454.8 288 384c0-32.5-12.12-62.13-31.1-84.63V96zM160 480H159.4c-52.75-.375-95.62-43.75-95.37-96.5c.25-39.5 22.5-61.38 31.1-72V96c0-35.25 28.75-64 63.1-64s63.1 28.75 63.1 64v215.5C233.1 321.9 256 344.1 256 384C256 436.9 212.9 480 160 480zM208 384c0 26.5-21.5 48-48 48S112 410.5 112 384c0-20.88 13.37-38.63 31.1-45.25V96c0-8.875 7.125-16 15.1-16s15.1 7.125 15.1 16v242.8C194.6 345.4 208 363.1 208 384z" />
              </svg>
            )
          }}
        />
        <Input
          label="Priority"
          name="priority"
          color="DEFAULT"
          variant='outlined'
          type="number"
          defaultValue={props.mapRegion?.priority || 0}
          validation={{ valueAsNumber: true }}
        />
      </ButtonGroup>

      <Switch
        name="outside"
        onLabel='Outside'
        defaultChecked={props.mapRegion?.outside}
      />

      {/* TODO: add conversion from lat/lon to coords */}

      <ButtonGroup>
        <Input
          label="Start X"
          name="start_x"
          color="DEFAULT"
          margin='dense'
          defaultValue={props.mapRegion?.start_x}
          type="number"
          validation={{ valueAsNumber: true }}
        />
        <Input
          label="Start Y"
          name="start_y"
          color="DEFAULT"
          margin='dense'
          defaultValue={props.mapRegion?.start_y}
          type="number"
          validation={{ valueAsNumber: true }}
        />
        <Input
          label="Start Z"
          name="start_z"
          color="DEFAULT"
          margin='dense'
          defaultValue={props.mapRegion?.start_z}
          type="number"
          validation={{ valueAsNumber: true }}
        />
      </ButtonGroup>

      <br />

      <ButtonGroup>
        <Input
          label="End X"
          name="end_x"
          color="DEFAULT"
          margin='dense'
          defaultValue={props.mapRegion?.end_x}
          type="number"
          validation={{ valueAsNumber: true }}
        />
        <Input
          label="End Y"
          name="end_y"
          color="DEFAULT"
          margin='dense'
          defaultValue={props.mapRegion?.end_y}
          type="number"
          validation={{ valueAsNumber: true }}
        />
        <Input
          label="End Z"
          name="end_z"
          color="DEFAULT"
          margin='dense'
          defaultValue={props.mapRegion?.end_z}
          type="number"
          validation={{ valueAsNumber: true }}
        />
      </ButtonGroup>


      <Alert severity='info'>
        Corner coordinates for region. These are Unreal Coordinates and not latitude / longitude
      </Alert>

      <Button
        type="submit"
        variant="outlined"
        color="success"
        hidden
        className='hidden invisible'
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
    </Form>
  )
})

export default MapRegionForm
