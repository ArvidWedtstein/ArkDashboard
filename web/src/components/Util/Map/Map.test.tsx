import { render } from '@redwoodjs/testing/web'

import Map from './Map'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Map', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Map />)
    }).not.toThrow()
  })
})
