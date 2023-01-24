import type { FindTribes } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Tribes from 'src/components/Tribe/Tribes'
import { toast } from '@redwoodjs/web/dist/toast'

export const QUERY = gql`
  query FindTribes {
    tribes {
      id
      name
      description
      created_at
      updated_at
      createdBy
      updatedBy
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No tribes yet. '}
      <Link
        to={routes.newTribe()}
        className="rw-link"
      >
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => {
  return (
    <section className="text-center">
      <div className="bg-[#0D2836] text-[#97FBFF] p-8 border max-w-3xl mx-auto border-[#60728F]">
        <h1 className="font-bold uppercase mb-3 text-2xl">{error.name}</h1>
        <h1 className="my-8">
          <span>{error?.message}</span>
        </h1>
        <div className="flex flex-row mt-3 items-center justify-center text-center space-x-3">
          <Link to={routes.home()} className="uppercase w-1/2 duration-150 bg-[#11667B] px-6 py-1 outline outline-1 transition-colors outline-[#11667B] outline-offset-1 hover:outline-offset-0 hover:outline-2">Accept</Link>
          {/* <Link to={routes.home()} className="uppercase w-1/2 duration-150 bg-[#11667B] px-6 py-1 outline outline-1 transition-colors outline-[#11667B] outline-offset-1 hover:outline-offset-0 hover:outline-2">Cancel</Link> */}
        </div>
      </div>
    </section>
    // <div className="rw-cell-error">{error?.message}</div>
  )
}

export const Success = ({ tribes }: CellSuccessProps<FindTribes>) => {
  return <Tribes tribes={tribes} />
}
