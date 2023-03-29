import type { FindLootcrateById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Lootcrate from 'src/components/Lootcrate/Lootcrate'

export const QUERY = gql`
  query FindLootcrateById($id: String!) {
    lootcrate: lootcrate(id: $id) {
      id
      created_at
      updated_at
      blueprint
      name
      map
      level_requirement
      decay_time
      no_repeat_in_sets
      quality_multiplier
      set_qty
      color
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Lootcrate not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ lootcrate }: CellSuccessProps<FindLootcrateById>) => {
  return <Lootcrate lootcrate={lootcrate} />
}
