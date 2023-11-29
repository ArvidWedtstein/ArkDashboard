import { render } from '@redwoodjs/testing/web'

import Ripple from './Ripple'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Ripple', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Ripple />)
    }).not.toThrow()
  })
})
