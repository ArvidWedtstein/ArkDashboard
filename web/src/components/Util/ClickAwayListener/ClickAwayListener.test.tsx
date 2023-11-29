import { render } from '@redwoodjs/testing/web'

import ClickAwayListener from './ClickAwayListener'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ClickAwayListener', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ClickAwayListener />)
    }).not.toThrow()
  })
})
