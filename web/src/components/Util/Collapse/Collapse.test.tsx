import { render } from '@redwoodjs/testing/web'

import Collapse from './Collapse'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Collapse', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Collapse />)
    }).not.toThrow()
  })
})
