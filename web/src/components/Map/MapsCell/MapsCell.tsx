import type { FindMaps } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Maps from 'src/components/Map/Maps'

export const QUERY = gql`
  query FindMaps {
    maps {
      id
      created_at
      name
      loot_crates
      oil_veins
      water_veins
      wyvern_nests
      ice_wyvern_nests
      gas_veins
      deinonychus_nests
      charge_nodes
      plant_z_nodes
      drake_nests
      glitches
      magmasaur_nests
      poison_trees
      mutagen_bulbs
      carniflora
      notes
      img
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No maps yet. '}
      <Link
        to={routes.newMap()}
        className="rw-link"
      >
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ maps }: CellSuccessProps<FindMaps>) => {
  return <Maps maps={maps} />
}
