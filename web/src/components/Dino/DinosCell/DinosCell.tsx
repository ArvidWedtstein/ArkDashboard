import type { FindDinos } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Dinos from 'src/components/Dino/Dinos'
import Pagination from 'src/components/Util/Pagination/Pagination';

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
        disable_tame
        x_variant
        attack
        mounted_weaponry
        ridable
        flyer_dino
        water_dino
        movement
        type
        carryable_by
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
  <div className='w-full h-full flex items-center justify-center bg-transparent'>
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

export const Failure = ({ error }: CellFailureProps) => {
  return <div className="rw-cell-error flex items-center space-x-3 animate-fly-in">
    <svg className="w-12 h-12 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M256 304c4.406 0 8-3.578 8-8v-176c0-4.422-3.594-8-8-8S248 115.6 248 120v176C248 300.4 251.6 304 256 304zM256 352c-8.836 0-16 7.164-16 16S247.2 384 256 384s16-7.164 16-16S264.8 352 256 352zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 496c-132.3 0-240-107.7-240-240S123.7 16 256 16s240 107.7 240 240S388.3 496 256 496z" />
    </svg>
    <div className="flex flex-col">
      <p className="font-bold text-lg leading-snug">Some unexpected shit happend</p>
      <p className="text-sm">{error?.message}</p>
    </div>
  </div>
}


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
