import { render } from '@redwoodjs/testing/web'

import ImageContainer from './ImageContainer'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ImageContainer', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ImageContainer />)
    }).not.toThrow()
  })
})
