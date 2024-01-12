import { render } from '@redwoodjs/testing/web'

import SplitPane from './SplitPane'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SplitPane', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SplitPane />)
    }).not.toThrow()
  })
})
