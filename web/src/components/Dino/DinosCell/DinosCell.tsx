import type { FindDinos } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Dinos from 'src/components/Dino/Dinos'
import Pagination from 'src/components/Pagination/Pagination';

// export const QUERY = gql`
//   query FindDinos {
//     dinos {
//       id
//       created_at
//       name
//       synonyms
//       description
//       taming_notice
//       can_destroy
//       immobilized_by
//       base_stats
//       gather_eff
//       exp_per_kill
//       fits_through
//       egg_min
//       egg_max
//       tdps
//       eats
//       maturation_time
//       weight_reduction
//       incubation_time
//       affinity_needed
//       aff_inc
//       flee_threshold
//       hitboxes
//       drops
//       food_consumption_base
//       food_consumption_mult
//       disable_ko
//       violent_tame
//       taming_bonus_attr
//       disable_food
//       disable_mult
//       water_movement
//       admin_note
//       base_points
//       method
//       knockout
//       non_violent_food_affinity_mult
//       non_violent_food_rate_mult
//       taming_interval
//       base_taming_time
//       exp_per_kill_adj
//       disable_tame
//       x_variant
//       attack
//       mounted_weaponry
//       ridable
//       flyer_dino
//       water_dino
//     }
//   }
// `

export const QUERY = gql`
  query FindDinos($page: Int) {
    dinosPage(page: $page) {
      dinos {
        id
        created_at
        name
        synonyms
        description
        taming_notice
        can_destroy
        immobilized_by
        base_stats
        gather_eff
        exp_per_kill
        fits_through
        egg_min
        egg_max
        tdps
        eats
        maturation_time
        weight_reduction
        incubation_time
        affinity_needed
        aff_inc
        flee_threshold
        hitboxes
        drops
        food_consumption_base
        food_consumption_mult
        disable_ko
        violent_tame
        taming_bonus_attr
        disable_food
        disable_mult
        water_movement
        admin_note
        base_points
        method
        knockout
        non_violent_food_affinity_mult
        non_violent_food_rate_mult
        taming_interval
        base_taming_time
        exp_per_kill_adj
        disable_tame
        x_variant
        attack
        mounted_weaponry
        ridable
        flyer_dino
        water_dino
      }
      count
    }
  }
`;

export const beforeQuery = ({ page }) => {
  page = parseInt(page) ? parseInt(page, 10) : 1;

  return { variables: { page } };
};

export const Loading = () => (
  <div className='w-full h-full flex items-center justify-center '>
    <span className='w-16 h-16 inline-block rounded-full border-t-4 border-white border-r-2 border-transparent animate-spin'></span>
  </div>
)

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No dinos yet. '}
      <Link
        to={routes.newDino()}
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

// export const Success = ({ dinos }: CellSuccessProps<FindDinos>) => {
//   return <Dinos dinos={dinos} />
// }

export const Success = ({ dinosPage }: CellSuccessProps<FindDinos>) => {
  return dinosPage.count > 0 ? (
    <>
      <Dinos dinosPage={dinosPage} />
      <Pagination count={dinosPage.count} route={"dinos"} />
    </>
  ) : (
    Empty()
  )
}
