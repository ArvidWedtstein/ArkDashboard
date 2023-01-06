import { render } from '@redwoodjs/testing/web'

import ContextMenu from './ContextMenu'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ContextMenu', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ContextMenu />)
    }).not.toThrow()
  })
})
