import { render } from '@redwoodjs/testing/web'

import List from './List'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('List', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<List />)
    }).not.toThrow()
  })
})
