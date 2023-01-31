import { render } from '@redwoodjs/testing/web'

import MapPicker from './MapPicker'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('MapPicker', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MapPicker />)
    }).not.toThrow()
  })
})
