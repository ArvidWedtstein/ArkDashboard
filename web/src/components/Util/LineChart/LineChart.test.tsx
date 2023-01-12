import { render } from '@redwoodjs/testing/web'

import LineChart from './LineChart'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('LineChart', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LineChart />)
    }).not.toThrow()
  })
})
