import { render } from '@redwoodjs/testing/web'

import Popper from './Popper'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Popper', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Popper />)
    }).not.toThrow()
  })
})
