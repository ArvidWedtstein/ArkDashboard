import { render } from '@redwoodjs/testing/web'

import BoxIndent from './BoxIndent'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('BoxIndent', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<BoxIndent />)
    }).not.toThrow()
  })
})
