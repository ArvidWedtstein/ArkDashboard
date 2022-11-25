import { render } from '@redwoodjs/testing/web'

import PingAlert from './PingAlert'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PingAlert', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PingAlert />)
    }).not.toThrow()
  })
})
