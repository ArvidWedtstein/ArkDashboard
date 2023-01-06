import { render } from '@redwoodjs/testing/web'

import MaterialGrid from './MaterialGrid'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('MaterialGrid', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MaterialGrid />)
    }).not.toThrow()
  })
})
