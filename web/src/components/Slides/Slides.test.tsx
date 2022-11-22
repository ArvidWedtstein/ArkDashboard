import { render } from '@redwoodjs/testing/web'

import Slides from './Slides'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Slides', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Slides />)
    }).not.toThrow()
  })
})
