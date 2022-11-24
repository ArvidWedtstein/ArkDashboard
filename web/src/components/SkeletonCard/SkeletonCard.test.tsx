import { render } from '@redwoodjs/testing/web'

import SkeletonCard from './SkeletonCard'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SkeletonCard', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SkeletonCard />)
    }).not.toThrow()
  })
})
