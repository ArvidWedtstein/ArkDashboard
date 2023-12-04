import { render } from '@redwoodjs/testing/web'

import MatrixGrid from './MatrixGrid'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('MatrixGrid', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MatrixGrid />)
    }).not.toThrow()
  })
})
