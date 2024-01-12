import { render } from '@redwoodjs/testing/web'

import TreeView from './TreeView'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('TreeView', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TreeView />)
    }).not.toThrow()
  })
})
